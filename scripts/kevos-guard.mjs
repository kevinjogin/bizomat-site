#!/usr/bin/env node
// kevos.com is the KEVOS site again (Stage 0, the owner's decision of 6 Nov 2026). The Cloudflare Worker behind it,
// throbbing-block-6c61, runs the KEVOS site built from c79e297, put back with `bizomat.ps1 restore kevos`. This
// repository's main branch is the BIZOMAT website, which runs on Fly.io (fly.website.toml, `bizomat.ps1 deploy
// website`). Nothing from here may publish to that Worker again.
//
// wrangler runs this before every deploy, upload and dev session ([build] in wrangler.toml), and `npm run deploy` runs
// it too. It lets only `npm run preview` (wrangler dev on this computer) through. Cloudflare's Workers Builds sets
// WORKERS_CI: until its Git connection is removed in the dashboard, its builds stop here, before kevos.com changes.

const inCloudflareBuild = Boolean(process.env.WORKERS_CI || process.env.WORKERS_CI_BUILD_UUID);
const localPreview = process.env.npm_lifecycle_event === 'preview';

if (localPreview && !inCloudflareBuild) process.exit(0);

console.error(
  [
    '',
    'Stopped: kevos.com stays the KEVOS site. This repository no longer publishes to the Cloudflare Worker',
    'throbbing-block-6c61 (kevos.com); the BIZOMAT website runs on Fly.io: .\\bizomat.ps1 deploy website.',
    inCloudflareBuild
      ? 'This is Cloudflare\'s Workers Builds: remove its Git connection in the Cloudflare dashboard (Workers & Pages > ' +
        'throbbing-block-6c61 > Settings > Build > Disconnect).'
      : 'To run the Worker on this computer: npm run preview.',
    '',
  ].join('\n'),
);
process.exit(1);
