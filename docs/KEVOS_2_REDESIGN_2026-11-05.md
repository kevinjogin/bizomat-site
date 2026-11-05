# KEVOS 2.0 frontend redesign (5 Nov 2026)

Owner brief: "Make difficult work simple." A premium, minimal frontend, UX and brand redesign of kevos.com. Backend, APIs, tools and content are unchanged.

## 1. Audit (before the redesign)

| Area | Finding |
|---|---|
| Stack | Astro 7 static site (4,400+ pages) served by the Cloudflare Worker `throbbing-block-6c61` (`src/worker.ts`: `/api/discover`, `/api/learn/*`, `/api/contact`, `/api/assessment`, redirects). Deploys from `main` through Cloudflare's GitHub integration. |
| Header | Four links (Tools, Library, About, Contact) and a theme switch. No product navigation; Work and CADOS were not linked anywhere on the site. |
| Homepage | Led with "What would you like to learn or achieve?" and a learning-path box, then side-by-side Tools and Library blocks, learning pathways and an About blurb. Accurate, but it presented KEVOS as a knowledge catalogue rather than a technology company with products. |
| Intelligence backend | Real and live: `/api/discover` (search terms and a solution path over the real catalogue) and `/api/learn/*` (learning paths) through Workers AI, with a keyword fallback and a no-JavaScript fallback to `/search/`. It recommends real tools and chapters; it does not open files or perform tasks. |
| Visual system | Dark theme by default; angular display face (Oxanium-based) for headings and Inter Tight for body; pill buttons; heavy shadows on the question box; some square and some pill CTAs. |
| SEO | Per-page titles, descriptions, canonicals, JSON-LD, sitemap, RSS, Pagefind, a strict CSP; a postbuild quality gate. The homepage title and site description still described CAD services in Sydney. |
| Positioning | About page described "a small technical services business" and "Services first", which no longer matched Work and CADOS existing. |
| Products | Work and CADOS live on their own subdomains (not in this repository). They could not be fetched from the build environment (network policy), so they are described only with the owner's own wording. Desk is planned. |

## 2. Owner decisions taken for this redesign

1. **Light theme by default** (warm white), dark as a per-session choice. Replaces the 8 Oct 2026 dark default.
2. **Library naming kept.** The Resources menu says "Library", not "READOS" (2 Nov 2026 rule confirmed). URLs unchanged.
3. **One type family:** Inter Tight for headings and body. The angular display face is no longer loaded. The wordmark SVG is unchanged.

## 3. Design system

- Colour tokens in `src/styles/global.css`: paper `#fbfaf7`, paper-2 `#f3f1ec`, surface `#fff`, ink `#1c1b19`, ink-2 `#3f3d39`, muted `#69665f`, hairline borders at 10 % and 20 % ink. Brand orange `#ff6a13` (logo, small marks), accent `#c2410c` for text and orange buttons (5.2:1 on white), hover `#9a3412`. Dark theme tokens kept.
- Type scale `--step--1` … `--step-5`, headings weight 620 with tight tracking, hero capped at about 70 px.
- Spacing: `--space-section`, `--max: 1200px`, 8 px button corners, 14 px card corners, `--shadow-1` (barely visible) and `--shadow-menu`.
- Components: `Button.astro` (primary charcoal, accent orange, secondary outline, text, inverse; small size), header menus, product card, status label (Available / Coming soon), solution block, section head (eyebrow, heading, one sentence).

## 4. What changed

| File | Change |
|---|---|
| `src/config/products.ts` (new) | Products (Work, CADOS, Desk) and solution areas: one source for header, footer, homepage, `/products/`, `/solutions/`. |
| `src/config/site.ts` | New `NAV` with menus, `GET_STARTED`, new `FOOTER_NAV`, new site title, description, tagline and statement. |
| `src/components/Header.astro` | Rebuilt: wordmark, Products / Solutions / Tools / Resources / About, Get Started, theme switch; `<details>` menus, Escape and outside-click closing, mobile panel. |
| `src/components/Footer.astro` | Rebuilt: identity, Products, Solutions, Resources, Company, legal. Desk is text, not a link. |
| `src/pages/index.astro` | New homepage (see the source-of-truth document). |
| `src/pages/products.astro`, `src/pages/solutions.astro` (new) | Product overview (with SoftwareApplication structured data for available products only) and solution areas. |
| `src/pages/resources/index.astro` | Resources hub, now holding the learning pathways moved from the homepage. |
| `src/pages/about.astro`, `src/data/brand.ts` | Positioning as a technology company with engineering roots; "What comes next" replaces "Services first". All existing sections kept. |
| `src/components/discovery/*`, `src/scripts/discovery.ts` | Box wording is now a prop (homepage: Ask KEVOS); example chips can carry a fuller question. Learning-path wording unchanged on Tools and Library. |
| `src/styles/global.css`, `discovery.css`, `tools.css`, `Button.astro`, `ReadOSBookHero.astro`, `ThemeToggle.astro`, `BaseLayout.astro`, `chat.astro` | Tokens, typography, light default, restrained buttons and question box. |
| `src/pages/privacy.astro` | Names the renamed homepage box; data handling unchanged. |
| Tests, `scripts/discovery/live-check.mjs`, `browser-check.mjs` | Updated to the new decisions. |

## 5. Not changed on purpose

Worker, APIs, tool calculators, Library content, URLs, redirects, contact and assessment forms, analytics settings (`wrangler.toml` untouched), the wordmark and favicon, the motion scenes on inner pages (purpose-built diagrams covered by `tests/motion-scenes.test.ts`).

## 6. Open items

- Verify the descriptions of Work and CADOS against the live products, and add a link back to https://kevos.com/ in both products' header or footer (separate repositories).
- Decide whether the inner-page motion scenes (Services, About, Industries, How It Works, Contact, legal pages) stay, become still images, or go, under the "no decorative animation" principle.
- Desk: when it launches, set `status: 'available'` and a `url` in `src/config/products.ts`; header, footer, homepage and `/products/` follow.
- Ask KEVOS does not yet recommend Work or CADOS in its answers; the product cards sit directly under the box instead.
