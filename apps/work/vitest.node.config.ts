// Tests on the Node runtime (`npm run test:node`), two projects:
//   suite    the existing Worker suite in test/ (written for workerd), run
//            unchanged on Node: `cloudflare:test` is served by
//            test-node/shims/cloudflare-test.ts (Node bindings),
//            `cloudflare:workers` by src/node/cloudflare-workers-shim.ts;
//   runtime  the Node runtime's own tests in test-node/ (D1/R2/KV bindings,
//            D1 parity with Miniflare, assets, HTTP server, WebSockets,
//            scheduler, migration scripts).
// The Worker vars come from wrangler.jsonc with the same test overrides as
// vitest.config.ts, and the migrations from the same reader, so both runs get
// identical inputs.
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { readD1Migrations } from '@cloudflare/vitest-plugin';
import { unstable_readConfig } from 'wrangler';

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig(async () => {
  const migrations = await readD1Migrations('migrations');
  const wrangler = unstable_readConfig({ config: here('./wrangler.jsonc') });
  const vars = { ...(wrangler.vars as Record<string, string>), ENVIRONMENT: 'test', ALLOW_SIGNUP: 'true', APP_URL: 'http://example.com', BREVO_WEBHOOK_TOKEN: 'test-webhook-token', SETTINGS_ENCRYPTION_KEY: 'BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc=',
    // The same BIZOMAT sign-in clients as vitest.config.ts ("cad-test" for test/company.test.ts, "cad" for test/system.test.ts).
    BIZOMAT_ID_CLIENTS: JSON.stringify([
      { id: 'cad-test', name: 'CAD Automation', secretSha256: '8ac950188678f9bb3524b275130332b511bf5092394da6975b5fb9e84302f026', redirectUris: ['https://cad.example.com/auth/bizomat/callback'] },
      { id: 'cad', name: 'CAD Automation', secretSha256: '0c9205f608f79c8a0b19e63475f552679d443a94fc5d6b042bb2db23c6025ee3', redirectUris: ['https://cad.example.com/auth/bizomat/callback'] },
    ]),
  };
  return {
    // This app's own tsconfig for every transform (see vitest.config.ts).
    tsconfig: './tsconfig.node.json',
    resolve: {
      alias: [
        { find: /^cloudflare:test$/, replacement: here('./test-node/shims/cloudflare-test.ts') },
        { find: /^cloudflare:workers$/, replacement: here('./src/node/cloudflare-workers-shim.ts') },
      ],
    },
    test: {
      provide: { TEST_MIGRATIONS: migrations, WORKER_VARS: vars },
      testTimeout: 30_000,
      hookTimeout: 60_000,
      projects: [
        { extends: true, test: { name: 'suite', environment: 'node', include: ['test/**/*.test.ts'], setupFiles: ['./test/setup.ts'] } },
        { extends: true, test: { name: 'runtime', environment: 'node', include: ['test-node/**/*.test.ts'] } },
      ],
    },
  };
});
