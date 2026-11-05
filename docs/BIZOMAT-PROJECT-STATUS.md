# BIZOMAT project status

_Last updated: 5 Nov 2026. Branch `claude/dazzling-mccarthy-31qg86` (mirrored to `feat/bizomat-unified-platform`) of
`jogkev-creator/gocore-website`. Not merged to `main`: merging publishes the website at kevos.com (`CLAUDE.md`)._

## 1. Where things stand

BIZOMAT is built as one platform in one repository: the website with Resources, CAD Automation (formerly CADOS) and
Project Management (formerly KEVOS Work), one brand and design system, one Fly.io app definition with a proxy and
four process groups, data migration tooling with dry runs, and the documentation set. Everything that could be built
and verified without production credentials is done and tested.

**The platform is not deployed yet and no production data has moved.** This session had no Fly.io or Cloudflare
token. bizomat.ai is live since 5 Nov, but served by the old `cados` Fly app (the owner's change). The security
remediation, the address move and the readiness review are in `BIZOMAT-PRODUCTION-READINESS.md`. Section 6 lists the
exact remaining actions; each one is the owner's, in order, with its checks and rollback.

## 2. Completion criteria (brief, section 20)

| # | Criterion | Status | Evidence |
| --- | --- | --- | --- |
| 1 | BIZOMAT branding implemented consistently | Done | One token and component set (`shared/brand/`) copied into the website and both apps (`npm run brand:check`); visual QA at 1440 and 390 px on every public and app page |
| 2 | New BIZOMAT logo | Done | Drawn wordmark, mark, maskable and favicon sets, light and dark (`shared/brand/glyphs.mjs`, `build.mjs`); in all three products, the CAD add-in, Companion and installer |
| 3 | H1 to H4 match the logo style | Done | Oxanium (chamfered, matching the wordmark) for every heading level in all three products; tests `tests/heading-font.test.ts`, `apps/cad/tests/test_fonts.py` |
| 4 | CADOS rebranded to BIZOMAT CAD Automation | Done, not deployed | Pages, MCP server name and instructions, add-in, Companion, installer (0.12.3); identifiers kept for compatibility (`apps/cad/CLAUDE.md`) |
| 5 | Complete PMO product integrated | Done, not deployed | `apps/work/` with full history; runs unchanged on Cloudflare and on Node for Fly; website `/work/` with "Start Managing Projects" |
| 6 | Complete KEVOS resources integrated | Done | 1,055 tools, 218 books, 2,358 chapters, guides and learning paths at the same paths; `/resources/` hub; 4,442 pages pass the build quality gate |
| 7 | Work users and data preserved and migration-verified | Tooling done and dry-run verified; live migration waits for credentials | `apps/work/scripts/migrate/` (import, files, verify, rollback export), reports per table; section 5 |
| 8 | Resources accessible without login | Done | The website is static and public: no page asks for an account; the Sign in menu only links to the two apps |
| 9 | Project Management requires login | Done | All workspace data needs a signed-in session and membership (workerd and Node suites, isolation tests, e2e) |
| 10 | Existing CAD functionality operational | Done in tests; not run on Windows | 295 Python tests (31 MCP tools, OAuth, device bridge, stand-in Companion end to end), 32 C# tests, add-in and Companion build |
| 11 | Unified navigation works | Done | CAD Automation, Project Management, Resources, Engine Room, AI Search, Sign in; both apps link back to the platform (BIZOMAT menu in CAD Automation, platform links in Project Management); `tests/navigation.test.ts` |
| 12 | AI search works securely | Done | Public catalogue only; AI returns terms and shortlist numbers, validated server-side; key server-side only; rate limited; works without AI (keywords) and without JavaScript (Pagefind) |
| 13 | Proof of Work with real evidence and animations | Done, in The Engine Room (`/engine-room/`) | Real product screens (example data), real test results, real tool names and command states, five SVG scenes with reduced-motion stills, each labelled |
| 14 | About and founder sections | Done, in The Engine Room | First-person letter signed "Kevin Jogin, Founder, BIZOMAT"; nothing invented (no biography, clients, figures) |
| 15 | Privacy, Terms, Disclaimer | Done, legal review needed | Written from the code; section 7 lists what a lawyer must review and what is missing |
| 16 | Existing URLs and compatibility preserved | Done | Same paths on bizomat.ai; 1,600+ redirects; kevos.com to bizomat.ai with path and query; CAD and Work hosts keep every path, MCP, OAuth and device routes |
| 17 | Single-app Fly.io architecture | Implemented, not deployed (blocker: no Fly token) | `fly.toml`, `infrastructure/`; image, proxy and compose stack tested locally (section 4) |
| 18 | Automated tests pass | See section 4 | |
| 19 | Migration results verified | Dry runs verified; live run pending | Section 5 |
| 20 | Deployment and rollback documentation | Done | `BIZOMAT-DEPLOYMENT.md`, `BIZOMAT-ROLLBACK.md`, `BIZOMAT-OPERATIONS.md`, `infrastructure/README.md` |

## 3. What was done, by phase

| Phase (brief section) | Result |
| --- | --- |
| Audit (1) | Three repositories, their deployments, data stores, secrets and risks recorded (`BIZOMAT-DATA-INVENTORY.md`, `BIZOMAT-SECURITY.md`) |
| Brand and design system (2) | `shared/brand/`: wordmark, mark, icons, social images, tokens (light and dark), components, fonts (self-hosted, OFL) |
| Website structure (3 to 9) | New homepage, `/cad/`, `/work/`, `/resources/`, `/engine-room/` (About and Proof of Work in one page, on the owner's request), `/privacy/`, `/terms/`, `/disclaimer/`, `/sign-in/`, AI search with platform pages |
| Visual system (10) | Seven SVG and CSS scenes (`src/components/visuals/`), one timeline, CSP-safe, reduced-motion stills |
| Data migration (11) | Project Management: D1 dump import, R2 copy, verify, rollback export; CAD: freeze, export, verify, import with manifests |
| Single Fly app (12, 18) | Proxy (59 tests), one image for four roles, per-role secret isolation, entrypoint guards, workflows, smoke test |
| Domains (13) | Routing table and compatibility map in `BIZOMAT-ARCHITECTURE.md`; cutover order in `BIZOMAT-DEPLOYMENT.md` |
| Security (14) | Review with findings F1 to F6; founder password reset for Project Management; proxy-aware client addresses in CAD |
| SEO, accessibility, performance (15) | One H1, descriptions, canonical, JSON-LD on every page (build fails otherwise); axe WCAG 2.1 AA clean on the main pages in light and dark; Lighthouse mobile: performance 100 and no layout shift on the homepage, product pages, the former Proof of Work and About pages and a Library book (90 on the tools hub, which loads its search) |
| Repository consolidation (16) | `git subtree` with full history: `apps/cad` (225 commits, AGPL-3.0-only kept), `apps/work` (14 commits) |
| Testing (17) | Section 4 |
| Documentation (19) | `docs/BIZOMAT-*.md`, `infrastructure/README.md`, per-app docs |

## 4. Test results

Every result below is from a run in this session on 5 Nov 2026; commands are in `CLAUDE.md` and each app's docs.

| Product | Suite (command) | Result |
| --- | --- | --- |
| Website | Type check (`astro check`, 731 files) | 0 errors, 0 warnings |
| Website | Unit and content tests (`npm test`) | 1,490 of 1,490 |
| Website | Build quality gate (`npm run build`: metadata, one H1, links, images, JSON-LD, CSP hashes) | 4,441 pages verified |
| Website | Node server for the web process (`tests/node-server.test.ts`) | 8 of 8 |
| Website | Accessibility (axe, WCAG 2.1 A and AA: home, CAD, Work, Resources, The Engine Room, legal pages, sign-in, products; light and dark) | 0 violations on all 20 |
| Website | Lighthouse mobile (local Node server): `/`, `/cad/`, `/work/`, `/resources/`, `/engine-room/`, a Library book (and the former `/proof-of-work/` and `/about/`) | Performance 100, accessibility 100, best practices 100, SEO 100, layout shift 0 on each; `/tools/` performance 90 |
| Website | Visual check at 1440 and 390 px | No overflow, no console errors; The Engine Room, its jump links and the old `/about/#work`, `/proof-of-work/#cad` and `#case-<id>` links followed in Chromium |
| Project Management | Workers runtime (`npm test`) | 198 of 198 |
| Project Management | Node 22 runtime (`npm run test:node`: the same suite plus runtime tests) | 293 of 293 |
| Project Management | Browser tests (`npm run test:e2e`, `npm run test:e2e:node`), desktop and phone | 9 of 9 on each runtime |
| Project Management | Lint and type check (client, Worker, Node) | Pass |
| Project Management | Migration dry run (`node scripts/migrate/dry-run.mjs`), repeated independently | 45 of 45 checks |
| CAD Automation | Python (`pytest`) | 294 passed, 2 skipped (no IPv6 and no .NET SDK on this host; the .NET end-to-end test passed in the CAD engineer's run with the SDK) |
| CAD Automation | Add-in and Companion (`bash solidworks/build.sh test`, .NET 8 SDK container) | Build with 0 warnings, 32 of 32 tests |
| CAD Automation | Sketch solver (`npm test`) | 9 of 9 |
| Platform | Edge proxy (`node --test infrastructure/proxy/test/*.test.mjs`) | 60 of 60 |
| Platform | Shell scripts and workflows (shellcheck, actionlint) | Clean |
| Platform | CAD server started as the platform starts it (`--host ::`) | Answers on loopback and the host address |
| Platform | GitHub Actions `BIZOMAT CI` on `a930c6f` (run 42075594794): website, Project Management, CAD Automation (pytest in two parts and the solver), proxy and platform files, and the image job | **All 7 jobs passed.** Image from the unmodified Dockerfile (all four roles, about 2.6 GB); entrypoint tests (secret isolation, volumes, secret files, maintenance mode, refusals); migration round trip in the image; the four services started from the same image; smoke test through the proxy **39 of 39** (every host and path family, redirects, security headers, CAD MCP refusing unauthenticated calls with 401, Project Management APIs and WebSockets refusing without a session); isolation check: each service holds only its own settings, runs as its own user with no capabilities and cannot read init's environment |
| Platform | Earlier CI runs | They found five problems that local runs could not, all fixed: the brand check compared git-ignored build output, Project Management tests resolved the website's tsconfig on a clean checkout, the entrypoint test made secret fixtures as the runner's user, the local stack had no HTTPS in front (the website correctly redirected), and the smoke test still listed the two pages that became the Engine Room |

Not run anywhere yet, because they need the real environment: the MSI and the add-in in SOLIDWORKS on Windows; a
deploy to Fly.io (6PN addresses, Fly's checks, certificates); the live D1 and R2 export.

## 5. Migration status

| Product | Tooling | Dry run | Live run |
| --- | --- | --- | --- |
| Project Management | Done | _see `BIZOMAT-MIGRATION.md`, section 4_ | Waits for a Cloudflare API token (D1 and R2 read) and the deployed app |
| CAD Automation | Done | Round trip in the image: byte-for-byte copy, refusals, backups | Waits for a Fly token and the deployed app |
| Website and Resources | Nothing to migrate | Built from Git: 4,442 pages | Deploys with the image |

## 6. Blockers and the exact remaining actions

| # | Action (owner) | Why it is not done here | Then |
| --- | --- | --- | --- |
| 1 | Ask both Project Management users to change their passwords (the two exposed exports were deleted on 5 Nov; PMO#1 merged) | Needs the owner to contact them | `BIZOMAT-PRODUCTION-READINESS.md`, section 3 |
| 2 | Deploy CADOS `main` (CADOS#11 merged: no server password; CADOS#12: `cad.bizomat.ai` alias) from the Fly dashboard, or add `FLY_API_TOKEN` to CADOS | Fly did not deploy `main` by itself; no Fly token here | Re-run the read-only live checks (readiness report, section 6) |
| 2a | Hosts: bizomat.ai is the BIZOMAT homepage, CAD Automation is `cad.bizomat.ai` (decided 5 Nov) | DNS and Fly certificates are the owner's | `BIZOMAT-DEPLOYMENT.md`, section 6a, steps 1 to 4 |
| 2b | Installer download: make CADOS public, or set `OPENSKETCH_INSTALLER_URL` to a public copy of the MSI | CADOS is private, so its release files are not public | Readiness report, section 7 |
| 3 | Create a Fly.io org token and store it as `FLY_API_TOKEN` in `jogkev-creator/gocore-website` | No Fly credentials | Run "BIZOMAT deploy" (creates the app and volumes) |
| 4 | Set `OPENSKETCH_PASSWORD` on `bizomat` to the same value as on `cados`, unless CADOS#11 (which removes it) is taken into `apps/cad` first | Secret values cannot be read back from Fly | Run "BIZOMAT deploy" again; smoke test |
| 5 | Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (D1 read, R2 read) | No Cloudflare credentials | "BIZOMAT migrate work data", dry run, then apply |
| 6 | CAD data move (`infrastructure/migrate/cad/README.md`) | Needs Fly access to both apps | Smoke test, then DNS for `cados.kevos.com` |
| 7 | DNS changes, one host at a time (`BIZOMAT-DEPLOYMENT.md`, section 6) | Production DNS needs the owner's approval | Rollback window starts |
| 8 | Merge to `main` when the website should go live on kevos.com | Merging publishes through Cloudflare's GitHub integration | Check the public site (`CLAUDE.md`, "After any production change") |

## 7. Legal review

Not legal advice; these need the owner and a lawyer before launch.

- **Operator details missing:** the legal entity that operates BIZOMAT, its ABN or ACN, business address and a BIZOMAT
  contact email are not recorded anywhere; the pages do not invent them. The only verified contact is
  `kevin@kevos.com` (used for privacy requests in Project Management).
- **Trade mark:** KEVOS is a registered Australian trade mark (No. 2469816, class 42). BIZOMAT is not registered: a
  clearance search and an application are recommended before launch; the site never marks BIZOMAT with ® or TM.
- **Domain:** confirm `bizomat.ai` is registered to the owner.
- **Terms:** governing law is New South Wales, Australia (carried over from the KEVOS terms); the liability clause
  relies on the Australian Consumer Law carve-out; fees and service levels are "as agreed in writing". Review all three.
- **Privacy:** the Australian Privacy Principles apply if the operator is covered (turnover above A$3 million or
  otherwise covered); overseas disclosure (Cloudflare, Fly.io in Sydney, Google sign-in, AI providers); the retention
  table; the right to deletion is handled by an operator procedure (`BIZOMAT-OPERATIONS.md`).
- **Disclaimer:** engineering output is never presented as certified; check it against the services actually sold.
- **Licences:** CAD Automation is AGPL-3.0-only: offering it as a network service obliges offering its source to its
  users (the repository is public).

## 8. Security follow-ups

See `BIZOMAT-SECURITY.md`. Open: F1 (owner action above), F2 (Fly token), F4 (raise PBKDF2 iterations after the
rollback window), F6 (drop Cloudflare Web Analytics from the CSP after the Worker is retired). F3 is enforced by the
entrypoint. F5 is addressed by the founder password reset; account erasure is an operator procedure until a feature
exists.

## 9. Log

| Date | Change |
| --- | --- |
| 5 Nov 2026 | Repositories consolidated with history; BIZOMAT brand system; website rebuilt as the platform site; CAD Automation and Project Management rebranded; Project Management Node runtime and migration tooling; single Fly app infrastructure; security review; documentation; layout-shift fixes (Lighthouse mobile CLS 0) |
| 5 Nov 2026 | The two PMO artifacts deleted (21:24 UTC) and verified gone; PMO#1 merged (restore points, artifact policy, daily cleanup); CADOS#11 reviewed and merged (no server password); CADOS#12 reworked to the owner's host decision (bizomat.ai the website, `cad.bizomat.ai` for CAD) with a Windows install test in CI; Worker routes for bizomat.ai; production checklist in the readiness report |
| 5 Nov 2026 | Security remediation and readiness review (`BIZOMAT-PRODUCTION-READINESS.md`): the two PMO database artifacts found and documented (deletion is the owner's); no workflow may upload a database, dump, backup or secrets file (PMO#1, `tests/artifact-policy.test.ts`); forced new password and founder security reset in Project Management; secret scan of all three repositories' trees and histories (test fixtures only); OPENSKETCH_PASSWORD analysed (removal in CADOS#11); bizomat.ai made the CAD app's address with old hosts redirecting pages (CADOS#12) |
| 5 Nov 2026 | Owner request: About and Proof of Work joined as **The Engine Room** (`/engine-room/`); the old addresses redirect (301) and their in-page links land on the matching sections; navigation reads CAD Automation, Project Management, Resources, Engine Room |
