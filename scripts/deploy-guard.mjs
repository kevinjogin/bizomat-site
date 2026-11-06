#!/usr/bin/env node
// Runs before every wrangler build of the website Worker ([build] in wrangler.toml: deploy, versions upload, dev).
//
// - `npm run preview` (wrangler dev on this computer) goes through.
// - Cloudflare's Workers Builds is refused: the website deploys from the owner's laptop, which checks the live site
//   afterwards (`.\cloudflare.ps1 deploy website`, which sets BIZOMAT_DEPLOY=website).
// - A deploy goes through only from the laptop tool, from a checkout with no changes that is exactly origin/main:
//   on 8 Oct 2026 a manual deploy from a checkout 145 commits behind replaced the site with an old design.
// - The configuration must be the Worker `bizomat` and never take kevos.com, which stays the KEVOS site on its own
//   Worker (throbbing-block-6c61).

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const WORKER = 'bizomat';
const env = process.env;

function refuse(lines) {
  console.error(['', 'Stopped before the build:', ...lines.map((l) => `  ${l}`), ''].join('\n'));
  process.exit(1);
}

function git(args) {
  const r = spawnSync('git', args, { encoding: 'utf8' });
  return { ok: r.status === 0, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
}

const inCloudflareBuild = Boolean(env.WORKERS_CI || env.WORKERS_CI_BUILD_UUID);
if (inCloudflareBuild) {
  refuse([
    "This is Cloudflare's Workers Builds. The website deploys from the owner's laptop: .\\cloudflare.ps1 deploy website.",
    'Turn the Git connection off in the Cloudflare dashboard (Workers & Pages > the Worker > Settings > Build).',
  ]);
}

let toml = '';
try {
  toml = readFileSync('wrangler.toml', 'utf8');
} catch {
  refuse(['wrangler.toml is not in this folder.']);
}
const name = /^name\s*=\s*"([^"]*)"/m.exec(toml)?.[1];
if (name !== WORKER) refuse([`wrangler.toml names the Worker "${name ?? ''}"; this site is the Worker "${WORKER}".`]);
if (/kevos\.com/i.test(toml.split('\n').filter((l) => /pattern|zone_name|custom_domain/.test(l) && !l.trim().startsWith('#')).join('\n'))) {
  refuse(['wrangler.toml routes kevos.com: kevos.com stays the KEVOS site on its own Worker.']);
}

if (env.npm_lifecycle_event === 'preview') process.exit(0);

if (env.BIZOMAT_DEPLOY !== 'website') {
  refuse([
    'Deploy the website with the laptop tool, which checks the live site afterwards: .\\cloudflare.ps1 deploy website.',
    'To run the Worker on this computer: npm run preview.',
  ]);
}

const changed = git(['status', '--porcelain', '--untracked-files=normal']);
if (!changed.ok) refuse(['This folder is not a git checkout of the website.']);
if (changed.out) refuse(['The checkout has changes (git status is not clean): deploy only what is on main.', ...changed.out.split('\n').slice(0, 10)]);
const fetched = git(['fetch', '--quiet', 'origin', 'main']);
if (!fetched.ok) refuse([`Could not fetch origin/main to compare (${fetched.err.split('\n').pop()}).`]);
const head = git(['rev-parse', 'HEAD']).out;
const main = git(['rev-parse', 'FETCH_HEAD']).out;
if (!head || head !== main) {
  refuse([`This checkout (${head.slice(0, 8) || '?'}) is not origin/main (${main.slice(0, 8) || '?'}): deploy only main, as it is now.`]);
}
console.log(`deploy guard: ${WORKER} from origin/main ${head.slice(0, 12)}`);
