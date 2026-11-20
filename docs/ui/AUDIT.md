# New UI audit (20 Nov 2026)

The owner sent the brief "BIZOMAT – UI design system and visual consistency" again on 20 Nov 2026. Its first rule is
to audit first and stop for approval. This is that audit, taken on `main` at 49bc722. Nothing on any page has changed.

The brief was first carried out on 19 Nov 2026: the tokens, the components, the UI kit and the flag
**`new_ui_enabled`** (off), released in kevinjogin/bizomat-site#91 (`docs/ui/README.md`). Since then 77 commits have
landed, among them the Knowledge Centre, Systems on one page, the module rail and side menus, the 97-module catalogue,
the Company Admin console and CAD Automation in the ERP. This audit checks three things:

1. What visitors and users see today (the flag is off): every button style, link style, spacing value, shadow, radius,
   colour and font size.
2. What the new UI already covers when the flag is on, and whether it still covers the code added since 19 Nov.
3. What the brief asks for that is not done.

The counts come from `node scripts/ui/audit.mjs` (read only; rerun it after each phase).

## 1. What already exists (19 Nov 2026)

| Brief item | State | Where |
| --- | --- | --- |
| Design tokens: spacing, radius, shadows, focus ring, motion, type, dark mode | Done | `shared/brand/ui-tokens.css` (copied to the website and the ERP) |
| Status colours (success, warning, danger, info) | Done, as tokens | `shared/brand/tokens.css` (`--bz-success` and so on, light and dark) |
| Buttons: 7 variants, 3 sizes, every state, loading without a width jump | Done in the ERP; partly on the website (section 4, G1 to G3) | `apps/work/src/client/styles/ui-new.css`, `src/styles/ui-new.css` |
| Links: animated underline, navigation highlight and indicator | Done | the same files |
| Cards, tables, forms, modals, drawers, menus, toasts | Done in the ERP; website cards partly (G4) | the same files |
| Route fade, skeleton loading, empty states | Done in the ERP | `lib/ui.ts`, `components/ui/ui.tsx` |
| Company switch cover | Partly (G9) | `lib/ui.ts`, `useCompanySwitchCover` |
| Every other stylesheet on the scales | Done, and still in step | generated overrides: ERP 865 rules, website stylesheets 608, Astro components 632 (`gen-overrides.mjs --check` passes) |
| ERP inline spacing | Done, and still in step | 325 inline values in 62 screens (`inline-styles.mjs --check` passes) |
| Density, Comfortable or Compact, saved per user | Done | Settings, Profile |
| WCAG 2.1 AA contrast check | Done for buttons, links and body text | `tests/ui-tokens.test.ts` |
| Reduced motion | Done | every duration is 0 ms under `prefers-reduced-motion` |
| UI kit for platform admins | Done for the ERP; no website section, no drawer (G12) | `/erp/admin/ui-kit` |
| Flag `new_ui_enabled` | Done, off | `apps/work/src/worker/platform/flags.ts` |
| Before and after screenshots | Not kept | taken on 19 Nov and never committed; the staging app they were taken on is retired (section 5) |

## 2. What people see today (flag off)

### Values

| | Website | ERP |
| --- | --- | --- |
| Sources counted | 73 (stylesheets and component styles) | 16 stylesheets |
| Font sizes | **81 distinct**, 552 uses (14.4, 14.7, 15.2, 12.5, 13.8 px...) | **26 distinct**, 269 uses (12, 13, 11, 12.5, 13.5 px...) |
| Spacing values | 53 distinct, 1,616 uses; **798 uses off the 4 px grid** (9.6, 6.4, 14.4, 17.6, 12.8 px...) | 38 distinct, 1,239 uses; **498 uses off the grid** (6, 10, 14, 18 px) |
| Border radius | 22 distinct (999, 10, 8, 14, 12, 6, 2, 4, 16, 7, 3, 9 px and corner mixes) | 16 distinct (999, 4, 3, 6, 10, 8, 7, 2, 14, 5, 12, 20 px) |
| Shadows written out | 14 distinct, 21 uses (most are focus rings and glows) | 26 distinct, 29 uses (indicator insets, rings, a pulse) |
| Colours written out (not tokens) | 23 distinct, 40 uses | 49 distinct, 85 uses, plus 8 inline in screens |
| Animation durations | 38 distinct, 114 uses (200, 150, 180, 250, 300 ms, and long drawing loops) | 8 distinct, 17 uses (120, 150, 180 ms...) |
| Easing curves | 6 (`ease` in 63 places) | 2 |
| Breakpoints | **28 distinct** (860, 560, 640, 1000, 960, 900, 544, 760, 520, 1050 px...) | 11 distinct (760 px in 19 places, 900, 1100, 1024...) |
| Fixed control heights | 30 distinct (44, 40, 38, 36, 48, 52, 46 px...) | 48 distinct (32, 22, 34, 26, 36, 44, 28, 48 px...) |
| ERP inline styles (not spacing) | | font sizes 15 (7 values), radii 10 (6 values), colours 8 |

Duplicates: the same value is often written two ways (`.9rem` and `0.9rem`), and near-equal values sit side by side
(website font sizes 14.1, 14.4, 14.7, 15.2 px; ERP 12, 12.5, 13, 13.5 px). The 11-step type scale replaces 81 website
sizes and 26 ERP sizes.

### Buttons

| Surface | Systems | Detail |
| --- | --- | --- |
| Website | **Three button systems** and six one-off buttons | `Button.astro` (`.button`: primary, accent, secondary, text, inverse; default 46 px and small; 102 uses), the shared `.bz-btn` (6 variants, small 36 px; 20 uses, only in the Knowledge Centre), the Tools page's `.btn` (44 px; 9 uses); one-off buttons in the header Sign in, Proof of Work, the booking card, AI Search (2) and the Library browser |
| ERP | One system | `.btn` with primary (555 uses), ghost (477), icon (176), danger (41), outline (0, kit only), link (1); sizes `.sm` (748), default, `.lg` (25), `.xl` (0); 1,884 buttons in all |

### Links and layout

- Website links share one global rule: the text colour, teal on hover, no animated underline (`src/styles/global.css`);
  components add their own. Navigation uses `.site-nav__link`.
- The ERP has **two page header patterns**: `PageHeader` (`.page-header`, 60 files) and the Maintenance pattern
  (`.mt-head`, `.mt-title`, `.mt-head-actions`) in 18 screens: Maintenance (5), Health and Safety (4) and nine ERP
  modules (Products, Changes, Documents, Suppliers, Purchasing, Inventory, Manufacturing, Quality, Supply Chain). The
  console (`admin/`, 22 files) has its own shell (`ac-*`).
- Two empty-state components: `EmptyState` (160 uses) and the console's `Empty` (69).
- Tables: `.data-table` almost everywhere, with module additions (`erp-table`, `crm-table`, `mt-table`); a few own
  tables (`pc-table`, `fin-lines`, `whs-heatmap`).
- The website's content width is one variable (`--max`) almost everywhere; section padding uses `--space-section` in
  14 places and fixed values in others.

## 3. What the new UI covers when switched on

Under `html[data-ui="new"]` every font size, spacing value and radius in every stylesheet and component (illustrations
excepted) is put on the nearest token, and the ERP's inline spacing too. Buttons, links, inputs, cards, tables,
overlays and the page template use only tokens. The generated files are in step with today's code: the pages built
after 19 Nov get the new spacing and type, because CI reruns the generator check.

What the generator does not do: it does not touch breakpoints, colours written out, transitions, or component
behaviour. Those are the gaps below.

## 4. Gaps

| # | Gap | Where | Proposed change (flag on only) | Phase |
| --- | --- | --- | --- | --- |
| G1 | The Knowledge Centre's buttons (`.bz-btn`, 20 uses) get no depth, motion, focus ring or loading state, and its small size is 36 px, off the 32, 40, 48 scale | `src/components/learn/*`, `src/pages/learn/index.astro` (built 20 Nov, after the new UI) | Same rules as `.button`; small to 32 px | 2 |
| G2 | The Tools page's `.btn` gets a lift only: no press, focus ring, disabled or loading state | `src/styles/tools.css` | Same rules as `.button` | 2 |
| G3 | Six one-off website buttons are outside the button system | `Header.astro` (Sign in), `ProofOfWork.astro`, `BookingCard.astro`, `ChatWidget.astro` (2), `LibraryBrowser.astro` | Put each on the button rules; the two drawn buttons in illustrations stay | 2 |
| G4 | Website cards added since 19 Nov do not lift or take the card radius and shadow | `lc-card`, `learn-card`, `dr-card`, `book-card`, `price-card` | Add them to the card rules | 3 |
| G5 | Colours written out instead of tokens: website 23, ERP 49 (and 8 inline) | across stylesheets | Map those equal to a token onto it; list the rest one by one (glows, chart colours) | 2 |
| G6 | Transitions keep their old timing (website 38 durations, `ease` in 63 places) | across stylesheets | Extend the generator: durations onto fast, base or slow, easing onto `ease-standard`; drawing loops stay | 5 |
| G7 | Two ERP page header patterns: the 18 Maintenance-style screens do not get the page template's title, gap and actions position | Maintenance, Health and Safety, nine ERP modules | Give `.mt-head`, `.mt-title`, `.mt-head-actions` the same template rules (CSS only); the console's title area the same | 4 |
| G8 | Modals and drawers close at once; the brief asks for a 200 ms close | `components/ui/overlays.tsx` | A short closing state in `Modal` and the side panel, then unmount | 5 |
| G9 | The company switch hides the page for a fixed 180 ms, with no skeleton, and does not wait for the new company's data. It only reacts to `/c/<company>/` addresses | `lib/ui.ts` | Hold the cover, with the skeleton, until the new company's first data arrives; add an end-to-end test that no record of the old company shows during a switch (CRM and Finance lists keep their previous data while loading; the switchers clear the cache, but this needs a test) | 5 |
| G10 | Breakpoints: website 28, ERP 11, against the four in the tokens (640, 1024, 1440 px) | across stylesheets | Cannot be put behind the flag: an old media query keeps firing between the old and new widths. Proposal: move to the four breakpoints in the cleanup after the switch-on (G15) | 7 |
| G11 | ERP inline font sizes (15), radii (10) and colours (8) | 77 screens with inline styles | Extend `inline-styles.mjs` to font size and radius with the same fallback pattern | 4 |
| G12 | The UI kit shows only the ERP's components: no website section, no drawer | `admin/pages/UiKit.tsx` | Add the drawer; add a website section (buttons, links, cards, forms) | 2 |
| G13 | Website tables (5 pages) and the AI Search dialog have no new-UI rules | `src/styles/ui-new.css` | Table header, row height and hover; dialog fade and scale | 3 and 5 |
| G14 | Contrast is tested for buttons, links and body text, not for badges and status colours | `tests/ui-tokens.test.ts` | Add badges and the four status colours, light and dark | 6 |
| G15 | Every old value is still in the source, with an override on top (2,105 generated rules) | both surfaces | By design, so the flag can switch back. After the owner switches it on for everyone and the rollback window passes: put the tokens into the source, remove the generated layer and the old values, and unify breakpoints (G10) | 7 |
| G16 | Documentation: `docs/ui/README.md` says ERP inputs are 40 px; they are 32 px, the height of the ERP's default button (as the brief asks: inputs match buttons). It also says screenshots were taken on staging | `docs/ui/README.md` | Correct both | 2 |

Size names differ but heights agree: website small 32, default 40, large 48; ERP default and `.sm` 32, `.lg` 40,
`.xl` 48 (the ERP's default is small because its screens are dense). I propose to keep the class names and label each
size by its height in the kit and the README, rather than renaming 1,884 buttons.

## 5. Conflicts with standing decisions

- **Staging.** The brief says to work on staging. The owner retired the staging app on 20 Nov 2026 ("keep all
  minimal"; CLAUDE.md, Deployment). Proposal: work in a local run of the whole stack
  (`infrastructure/local/compose.yml`, with the flag on there), take the screenshots there with Playwright, and check
  production through the UI kit's preview switch, which shows the new UI in that platform admin's browser tab only and
  changes nothing for anyone else. No new Fly app.
- **Screenshots.** The repository is public, so screenshots are not committed. They would be delivered in this
  conversation (website page types at desktop and phone width; each ERP module; flag off and on; light and dark;
  Compact).
- **Switching on.** The flag stays off. Only the owner switches it on (Control Centre: a company or the `internal`
  stage first, then everyone).

## 6. Proposed plan

| Phase | Work | Gaps |
| --- | --- | --- |
| 2 | Core components: website buttons onto one system, colours onto tokens, the kit's website section and drawer, README corrections | G1, G2, G3, G5, G12, G16 |
| 3 | Website layout: cards, tables, section padding onto `--space-section` | G4, G13 |
| 4 | ERP modules one at a time: one page template (the Maintenance pattern included), inline font sizes and radii | G7, G11 |
| 5 | Transitions: token timing everywhere, modal and drawer close, the company switch held until data arrives, the AI Search dialog | G6, G8, G9, G13 |
| 6 | Accessibility and performance: contrast for badges and status colours, reduced motion, no layout shift on hover, screenshots, release with the flag off | G14 |
| 7 | After the owner's switch-on for everyone and the rollback window: tokens into the source, the generated layer removed, four breakpoints | G10, G15 |

Every phase keeps the rule that nothing changes with the flag off, and changes no route, behaviour or company-scoped
check. Each ends with the website's and the work app's checks and screenshots.
