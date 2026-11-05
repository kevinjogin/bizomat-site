// Bundles the website's Node server (src/node/server.ts, which runs src/worker.ts) into dist-server/server.mjs for the
// "web" process of the BIZOMAT Fly.io app. Run after `npm run build` (the server serves dist/).
import { build } from 'esbuild';

await build({
  entryPoints: ['src/node/server.ts'],
  outfile: 'dist-server/server.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  sourcemap: false,
  legalComments: 'none',
  logLevel: 'warning',
  banner: { js: "import { createRequire as __bzRequire } from 'node:module'; const require = __bzRequire(import.meta.url);" },
});
console.log('Website server bundled: dist-server/server.mjs');
