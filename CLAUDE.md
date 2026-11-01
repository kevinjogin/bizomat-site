# KEVOS website: permanent project instructions

Read this file, `docs/KEVOS_SOURCE_OF_TRUTH.md` and `docs/KEVOS_READOS_PUBLISHING.md` before any change.

## Identity

- **KEVOS is the active, approved website and business identity** (https://kevos.com).
- **GoCore is a retired identity.** The repository is still named `gocore-website`, and legacy names remain in Git history, some file names, some code identifiers and older articles. None of that is permission to restore GoCore branding, blue logos, the GC favicon, gocore.com.au, or older templates.
- Never name the founder on the website. Never invent clients, projects, results, statistics, prices or partnerships.

## Source of truth

- **Authoritative source:** GitHub `jogkev-creator/gocore-website`, branch `main`. Not old conversations, not cached files, not a local folder that has not been fetched.
- **Before any work:** `git fetch origin` and confirm the working branch is at or ahead of `origin/main` with no unexplained local changes. If local `main` is behind, fast-forward it (`git merge --ff-only origin/main`). If there are uncommitted changes, preserve them on a backup branch first; never overwrite them.
- Never merge older GoCore branches (for example `origin/gocore-pro-tools`) into `main`. Never regenerate the site from historical templates.

## Deployment (production)

- Cloudflare account: `Kevinjogin@protonmail.com's Account` (`21a5414f507ae268302531c39e888f95`).
- Worker: **`throbbing-block-6c61`** (the only Worker in the account). Route `kevos.com/*` (zone `kevos.com`) from `wrangler.toml`; a Workers custom domain `kevos.com → throbbing-block-6c61` is also attached.
- **Two deployment sources update this Worker:** (1) Cloudflare's GitHub integration builds and deploys pushes to `main` (README §10; deployment timestamps match pushes), and (2) manual `npm run deploy` / `npx wrangler deploy` from a local checkout. A manual deploy uploads whatever is in the local `dist/`, so it can silently replace the live site.
- **Rule:** prefer publishing by pushing a verified commit to `main`. Only run `npm run deploy` from a clean checkout whose `HEAD` equals `origin/main`, immediately after a fresh `npm run verify`. Never upload an old `dist/`.
- **Incident, 8 Oct 2026:** at 07:34 UTC a manual `wrangler deploy` from a stale local checkout (commit `501467d`, 145 commits behind `origin/main`) replaced the KEVOS site with the old GoCore design (version `304698c7`). KEVOS was restored by later deployments from `main`. This is why the rule above exists.

## Change control

- A content request changes only `src/content/reados-chapters/` (and its images) and, to place a chapter in a book, `src/utils/reados-collections.ts`. The Insights section was retired on 17 October 2026; never recreate `/insights/` (its URLs redirect to READOS chapters). Never change layouts, components, CSS, logos, favicons, animations, navigation or legal pages as part of a content request. If a website-level change seems necessary, stop and ask.
- Stage files by explicit path. Never `git add -A` or `git add .` for a release. Inspect `git diff --cached --stat` before committing.
- Documentation and project-memory changes go in their own commit, separate from content commits.
- `npm run build` runs `scripts/build-kevos-icons.mjs`, which rewrites `public/brand/kevos-favicon-k-orange.svg`, `public/brand/kevos-icon.svg`, `public/favicon.svg`, `public/favicon.ico` and creates `public/brand/kevos-favicon-k-orange-*.png`. On Windows these show as modified (line endings, encoder bytes). They are build side-effects: do not commit them; restore with `git restore` after building.
- Never run `python scripts/brand/build_brand.py` (retired GoCore artwork generator).

## Commands

```bash
npm ci              # install pinned dependencies
npm run verify      # astro check + tests + build (icons, Astro, Pagefind, postbuild checks)
npm run reading-time -- <slug>   # article length check
npm run deploy      # verify, then wrangler deploy (see deployment rule above)
```

## After any production change

Check the public site, not just the build: `https://kevos.com/`, `/services/`, `/reados/`, `/about/` and every new chapter URL. Confirm the orange KEVOS wordmark, the orange K favicon (`/brand/kevos-favicon-k-orange.svg`), navigation with WORKOS, READOS, About and REACHOS, the homepage "Explore WORKOS" and "Explore READOS" buttons, that a new session opens in the dark theme, and that switching to light lasts only for that session. Compare the active deployment (`npx wrangler deployments list`) with the release commit. Do not report anything as live until its public URL has been checked.
