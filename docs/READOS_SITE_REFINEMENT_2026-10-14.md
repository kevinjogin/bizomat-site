# KEVOS site refinement, 14 October 2026

Baseline: `2b779cd76501de89e72978c16831ff3f8e5ef628` on GitHub `main`.
Work branch: `codex/reados-site-refinement`.

## What changed

- Shared header and footer links use CSS uppercase styling. Product names, accessible names, destinations, active states and existing mobile behaviour are retained. The actual tools product is TOOLOS; no DATAOS route or menu item was invented.
- READOS now uses the existing Hero and MotionVisual components. Its own scene connects document cards, topics, a book shelf and an open chapter reader. A twelve-second CSS loop moves documents, highlights a topic, opens the book cover and turns a reading page. It uses the existing grid, orange theme variables, wordmark and fonts. No library, image download, script or font dependency was added.
- The illustration has one descriptive figure caption. Decorative elements are hidden from assistive technology. Reduced-motion CSS disables every animation in the scene and leaves all five stages visible.
- Public-facing copy was edited in context across 49 source files, including 13 Insights articles and four original Library chapters. Changes cover the homepage, About, contact, resources, Library, READOS templates, search, metadata, shared service descriptions, forms, assistant labels and tool descriptions. Article headings and frontmatter were retained to preserve chapter order and fragment links.
- The privacy page and assistant FAQ now correctly identify the existing Proton Calendar booking service. Other legal terms and data-handling commitments are unchanged. This matches `SITE.booking` and [Proton's booking documentation](https://proton.me/support/calendar-appointment-scheduling).
- Mobile checks found that the assistant launcher lost its accessible name when its visible text was hidden. It now has an explicit `Ask KEVOS` label.
- Calculator interaction checks found 24 pre-existing numeric step mismatches, such as a default price of 25 with minimum 0.01 and step 1. These defaults blocked native form submission. The affected field steps now accommodate the specified decimal values. Tool IDs, field keys, defaults, limits, units and all calculation formulas remain unchanged. A regression test checks every numeric default in all 62 tools.

## Editorial review and safeguards

772 tracked source files were screened, including 659 Markdown files, page templates, shared components, structured content and client-side tool bundles. This was a site-wide pattern audit with contextual review of flagged prose and shared interfaces, not a claim that every long-form page received a complete line edit.

Edits used an explicit list of source passages and replacements, followed by diff review. There was no global punctuation deletion or runtime text-replacement filter. Technical ranges, absent-value table markers, quoted teaching prompts, legal case names, established terms, units, formulas, URLs and programming punctuation remain where they have a purpose. Unnecessary promotional punctuation and vague claims were rewritten as complete sentences.

For every edited Markdown file, automated comparisons against the baseline verified that frontmatter, fenced and inline code, link destinations, headings, source attribution lines, blockquotes and numeric values were identical. All 17 edited long-form files passed. Tools were evaluated from their data bundles and compared structurally, allowing only reviewed wording changes and the 24 step corrections. All seven calculator bundles were compared against the baseline, allowing only two specific explanatory sentence edits.

## Validation

- Pinned dependencies installed with `npm ci`; lockfile unchanged.
- `npm run verify`: 46 tests passed, zero Astro errors and warnings, eight existing hints.
- Production build verified 2,307 HTML pages, metadata, one H1, internal links, images, JSON-LD and CSP. Pagefind indexed 1,933 pages.
- Route comparison confirmed that all 2,307 page paths and canonical URLs are unchanged.
- The break-even calculator accepted A$11,000 fixed costs, A$25 selling price and A$14 variable cost, returning 1,000 units, A$25,000 revenue and a 44% contribution margin. Browser checks recorded no errors or warnings.
- Main, tools, contact and READOS pages checked at 320, 768 and 1280 pixels; no horizontal page overflow. Header height remained 72.8 pixels. All visible shared navigation links computed to uppercase.
- READOS checked in dark and light themes, including a 390-pixel mobile view. Compiled reduced-motion selectors cover all eight animated elements; browser preference emulation was not available.
- Search returned the book and all ten chapters for the test term `Fieldnote`. Chapter selection reached chapter ten, and larger text changed the reading font from 19.84 to 22.4 pixels. Mobile chapter content fitted the viewport.
- Browser interaction checks and deployment evidence are recorded in the release evidence folder below. Contact delivery is covered by automated tests; no test customer enquiry was sent.

## Files and evidence

54 application source files and two existing test files changed. The accompanying `READOS_SITE_REFINEMENT_FILES_2026-10-14.json` lists them, identifies the 17 long-form edits and records all numeric step corrections.

Local review evidence, screenshots, audit scripts and logs are in `C:\dev\KEVOS-SYNC-BACKUPS\refinement-2026-10-14`. They are not website assets. The existing untracked work in `C:\dev\gocore-website` was kept separate. Generated favicon changes were excluded from the release.

The existing dependency audit reports four high-severity advisories. Dependency upgrades are outside this refinement. No package, deployment configuration, secret or environment file changed.

Publication uses the existing GitHub main-branch Cloudflare workflow and Worker `throbbing-block-6c61`. The final live deployment ID and commit are recorded in the external release status after publication, avoiding a documentation-only deployment loop.
