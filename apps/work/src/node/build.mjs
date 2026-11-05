/* global console */
// Bundles the Node runtime (`npm run build:node`):
//   src/node/server.ts + the Worker code it imports -> dist/node/server.mjs
// ESM, platform node, target node22. `cloudflare:workers` resolves to the
// shim in src/node/cloudflare-workers-shim.ts. The SQL files in migrations/
// are embedded, so a deployment needs only dist/node/server.mjs and
// dist/client/ (the SPA from `npm run build:client`).
import { build } from 'esbuild';
import { readdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const migrationsDir = join(root, 'migrations');
const migrations = readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .sort()
  .map((name) => ({ name, sql: readFileSync(join(migrationsDir, name), 'utf8') }));

const shim = join(root, 'src/node/cloudflare-workers-shim.ts');
const outdir = join(root, 'dist/node');
rmSync(outdir, { recursive: true, force: true });

await build({
  absWorkingDir: root,
  entryPoints: ['src/node/server.ts'],
  outfile: 'dist/node/server.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  keepNames: true,
  sourcemap: 'linked',
  sourcesContent: false,
  legalComments: 'none',
  logLevel: 'warning',
  define: { __WORK_MIGRATIONS__: JSON.stringify(migrations) },
  // CommonJS dependencies (ws) call require() for Node built-ins.
  banner: { js: "import { createRequire as __workCreateRequire } from 'node:module';\nconst require = __workCreateRequire(import.meta.url);" },
  // Optional native accelerators of ws; it falls back to JavaScript without them.
  external: ['bufferutil', 'utf-8-validate'],
  plugins: [
    {
      name: 'cloudflare-workers-shim',
      setup(b) {
        b.onResolve({ filter: /^cloudflare:workers$/ }, () => ({ path: shim }));
      },
    },
  ],
});

console.log(`dist/node/server.mjs built (${migrations.length} migrations embedded: ${migrations.map((m) => m.name).join(', ')})`);
