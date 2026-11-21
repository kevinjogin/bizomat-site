# The BIZOMAT UI design system (new UI)

Owner's UI brief of 19 Nov 2026 ("BIZOMAT – UI design system and visual consistency") and the owner's decisions of the
same day: buttons 32, 40 and 48 px; the ERP on a 4 px grid; the Comfortable or Compact choice saved per user account;
the website reads the flag every minute; flags off until verified. The brief came again on 20 Nov 2026: its audit
(`docs/ui/AUDIT.md`) found 16 gaps, and the owner approved phases 2 to 6 on 21 Nov 2026, with a local run and the UI
kit's preview in place of the retired staging app. What those phases added is marked "(21 Nov)" below.

Everything here is behind the flag **`new_ui_enabled`** (`apps/work/src/worker/platform/flags.ts`, scopes global,
rollout stage and company; ships off). With the flag off nothing changes: every new rule waits for
`html[data-ui="new"]`, and the inline spacing variables fall back to the old values.

## How the flag reaches each surface

| Surface | How it turns on |
| --- | --- |
| BIZOMAT ERP and the tools inside it | `GET /api/auth/me` returns `ui: { newUi, density }` (`routes/auth.ts`, `uiFor`): on when the flag is on for everyone, for the person's rollout stage, or for a company they belong to. `lib/ui.ts` sets `data-ui="new"` and `data-density` on `<html>`. |
| The website | The web process asks `GET /tasks/api/ui/public` (only the global value; no sign-in, `no-store`) every minute (`src/node/server.ts`, `newUiSwitch`), at `WEB_UPSTREAM_WORK` (the entrypoint passes the proxy's `UPSTREAM_WORK` to the web role under that name). While on, the asset store (`src/node/assets.ts`) serves every page with `data-ui="new"` on `<html>`, marked **before** compression, under its own ETag (`...-ui`), so a browser never keeps a page of the other look and a Brotli or gzip page always decodes. `WEB_NEW_UI=on|off` fixes it for tests and local runs. A work process that cannot be reached keeps the last answer. |
| Platform admins | The UI kit (ERP console, `/erp/admin/ui-kit`) has a preview switch that shows the new UI in that browser tab only (session storage). |

## Tokens (`shared/brand/ui-tokens.css`)

Copied by `shared/brand/build.mjs` to the website (`src/styles/bizomat/ui-tokens.css`) and the ERP
(`apps/work/src/client/styles/bizomat-ui-tokens.css`) only; never to CAD Automation (its copy of `tokens.css` is CADOS's
file, and `ui-tokens.css` is not in it).

- Spacing, a 4 px grid: `--bz-space-0` to `--bz-space-16` (0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 px).
- Radius: `--bz-radius-sm` 6, `-md` 8, `-lg` 12, `-full` 9999 px.
- Shadows: `--bz-shadow-xs` to `--bz-shadow-xl` (the brief's values; stronger in dark), `--bz-focus-ring` (teal, 30%).
- Motion: `--bz-duration-fast` 120, `-base` 200, `-slow` 300 ms; `--bz-ease-standard`, `--bz-ease-out`. All zero under
  `prefers-reduced-motion: reduce`.
- Type: `--bz-text-2xs` (11 px) to `--bz-text-5xl` (48 px), in rem; leading tokens.
- Controls (owner): `--bz-control-sm` 32, `-md` 40, `-lg` 48 px, with their paddings.
- Layout: page padding, section and item gaps, content width 1200 px, a 12-column grid.
- Density: `html[data-density="compact"]` takes every spacing and control one step down (controls 28, 32, 40 px).

`tests/ui-tokens.test.ts` holds these values, the copies, and WCAG 2.1 AA contrast (4.5:1) for every text colour pair
used by buttons, links and body text, light and dark.

## Components

- **ERP** (`apps/work/src/client/styles/ui-new.css`): buttons (sizes: the default and `.sm` are small, 32, because the
  ERP's screens are dense; `.lg` is medium, 40; `.xl` large, 48; primary, secondary, outline, ghost, danger, link and
  icon; hover lifts 1 px with a medium shadow, pressing settles, a focus ring from the keyboard, disabled, and
  `aria-busy` with a spinner), text links with an underline that fills in, navigation items and tabs with an indicator,
  inputs and selects at 32 px, the height of the default button (`.lg` 40), with the focus ring, cards (radius large, a
  small shadow, padding 24, clickable ones lift), tables (sticky header, row hover), modals, drawers, menus and toasts
  (fade and scale in; toasts bottom right), page layout, a fade between routes (`useUiRouteEffects`), skeleton loading
  (`Loading` renders skeleton lines that show only under the new UI, the old spinner otherwise) and empty states.
- **ERP, 21 Nov**: modals and drawers **close** in 200 ms (`useExitAnimation` in `lib/ui.ts`: when React removes the
  overlay, an inert copy hidden from assistive technology fades out; the overlay itself, focus and the screen behind it
  are not held up; nothing is copied under reduced motion or for an overlay with a frame, video or canvas), used by
  `Modal`, the new `Drawer` (`components/ui/overlays.tsx`) and the board's item panel. The **company switch**
  (`useCompanySwitchCover`) covers the page with a skeleton until no query naming the new company is still loading
  (at least 120 ms, at most 2 s), reading the query cache directly so no screen renders again for it; the switcher
  already drops every cached record of the old company. One **page template** for the record headers of Maintenance,
  Health and Safety and the ERP modules (`.mt-head`, `.mt-title`, `.mt-head-actions`) and the older console's top bar
  (`.ac-top`). The console's status pills and banner use the status colours.
- **Website** (`src/styles/ui-new.css`): the same for `.button` (40 by default, 32 small, 48 in heroes and closing calls
  to action), text links in running text (links without a class of their own, not inside `<nav>`), the site navigation,
  cards (lift when they are links), forms, menus, a page fade, one heading rhythm inside articles and legal pages, and
  one size and colour for the section label (`.bz-eyebrow`, which a section head's paragraph rule used to make as large
  as a lead).
- **Website, 21 Nov**: **one button system** for every button: the Button component, the Knowledge Centre's shared
  `.bz-btn` (its small size is 32, not 36), the Tools page's `.btn`, the header's Sign in, Proof of Work, the booking card
  and AI Search (8 px corners everywhere; the booking card and AI Search set their size next to their own, more specific
  rules); link-style buttons (the Library's, AI Search's Cancel) with the underline; disabled and loading (a spinner,
  the label kept so the width does not jump) states. `tests/ui-tokens.test.ts` fails on a button class that is not in
  these rules. Cards not covered before (`lc-card`, `learn-card`, `dr-card`, `book-card`, `price-card`, `sys-box`).
  **Tables** (articles, Systems, the analysis tables, figures): one cell padding and type, a bold header on a stronger
  rule, a row highlight on hover; the website's tables are short and sit in scrolling wrappers, so their headers do not
  stick. **Sections**: the closing bands and the Knowledge Centre's bands take `--space-section` (64, 48 or 40 px), and
  every page's opening section the same at the top and three quarters of it below. The **AI Search** panel has the
  largest shadow and fades out in 200 ms when it closes.
- Only `transform`, `opacity` and `box-shadow` animate. Nothing moves under reduced motion.
- **Focus from the keyboard** (21 Nov): a solid 2 px teal outline, 2 px off the control, with the brief's 30% ring
  (`--bz-focus-ring`) around it on buttons, links and tabs; fields change their border to teal with the ring. The 30% ring
  alone is too faint for WCAG 2.1 (a focus indicator needs 3:1), and an outline is not a shadow, so no hover or variant
  shadow can hide it. The website's design audit (`scripts/design-audit`, run with the new UI on) found the first version
  of 21 Nov dropping the ring on outline buttons; `tests/ui-tokens.test.ts` now fails on any focus rule without an
  outline.

## How the existing screens were converted

1. **Generated overrides** (`scripts/ui/gen-overrides.mjs`; `--check` in CI through `tests/ui-tokens.test.ts`): every
   hard-coded padding, margin, gap, font size and radius in the ERP's stylesheets, the website's stylesheets and each
   Astro component's `<style>` is put on the nearest token, under `html[data-ui="new"]` (`:global(...)` in Astro). Since
   21 Nov also every **transition and short animation**: a duration up to 150 ms becomes fast (120), up to 250 ms base
   (200), up to 400 ms slow (300), the easing ease-standard (transitions) or ease-out (animations). Only the longhands
   are written (`transition-duration`, `transition-timing-function` and the animation ones), so a new-UI rule that
   names what moves keeps its list; buttons' own transitions are left to the button rules; longer animations (spinners,
   pulses, drawings), `linear` and delays stay. ERP 893 rules, website stylesheets 615, Astro components 649 (21 Nov).
   Rerun it after changing a stylesheet.
2. **Inline values in the ERP** (`scripts/ui/inline-styles.mjs`; `--check` in CI): inline spacing numbers became
   `var(--ui-sN, Npx)`, and since 21 Nov inline font sizes `var(--ui-fN, Npx)` and corners `var(--ui-rN, Npx)` (24 more
   in 13 screens): the old value while the flag is off, a token under the new UI. `tests/ui-tokens.test.ts` fails on a
   variable that has no token in `styles/ui-new.css`.
3. **Shared components by hand**: `Loading`, the UI kit, the density choice, the website server.

## Density (Comfortable or Compact)

Settings, Profile, "Density" (shown when the new UI is on for the person). Saved on the account (`users.preferences_json`,
`density`), so it follows the person to every computer; it changes spacing and control heights only, never what is
shown. The theme stays a per-computer choice (CLAUDE.md, "Rules for every page").

## The UI kit

`/erp/admin/ui-kit` (platform admins; also `/tasks/admin/ui-kit` in the older console): every shared component with its
variants, sizes and states (buttons including disabled and loading, links, navigation, tabs, inputs with help and error
text, cards, badges, a table, a modal, a drawer (21 Nov), a menu, toasts, loading and empty states), with the preview and
density switches. **Website** (21 Nov, `UiKitWebsite.tsx`): the website's pages refuse to be framed and its components'
styles are scoped to them, so the kit reads five of the website's pages on the same address, takes their stylesheets and
one real example of each component (buttons, also disabled and loading; links; cards; form fields), and shows them in a
sandboxed frame that runs no script, with the new UI on or off as the preview says. Where the website is not served (a
local run of the work app alone, work.kevos.com) it says so.

## What is not converted (and why)

- **Illustrations** (`src/components/visuals/*`, `*Art`, `*Illustration`, `*Visual`, `*Drawing`, `*Cover`, `*Map`,
  `*Portrait` components and `src/styles/visuals.css`): their geometry is in SVG units and must keep its finished still.
  Font sizes under 10 px anywhere are drawing labels and stay too.
- **Hairlines**: spacing of 1 to 3 px (borders, nudges) stays as it is.
- **Values already on a variable or a formula** (`var()`, `calc()`, `clamp()`, `min()`, `max()`, `em`, `%`): kept; they
  already scale.
- **Literal shadows**: 2 in the ERP and 6 on the website are not on the shadow tokens (coloured glows and inset rings
  inside components); the shadow variables they share (`--shadow-1/2/3`, `--shadow-menu`) are remapped to the tokens.
- **Colours written out** (21 Nov, checked one by one): on the website every one is deliberate (print styles, code
  highlighting, the paper of report previews, QR codes, white figures on navy counters); in the ERP all but the
  console's status pills and banner (now on the status colours) are white text on coloured fills (labels, avatars,
  timeline bars), white paper behind QR codes, labels, signatures and previews, black behind camera video, the console's
  dark navy band, or fallbacks inside `var()`. They stay.
- **Breakpoints**: the website uses 28 and the ERP 11 widths, against the four of the tokens (640, 1024, 1440). A media
  query cannot wait for the flag (an old one keeps firing between the old and new widths), so they move to the four in
  the clean-up after the owner switches the flag on for everyone (`docs/ui/AUDIT.md`, phase 7, not yet approved).
- **Computed inline geometry** in the ERP (widths, heights, positions, chart sizes): geometry, not spacing.
- **CAD Automation's own pages** (`/cad`): a separate application from kevinjogin/bizomat-cad with its own design system;
  out of scope for this flag.

## Before and after

Screenshots of every website page type (desktop and phone) and every ERP module, flag off and on, light and dark, and
Compact density, were taken locally on 19 Nov 2026 before the first release. On 21 Nov 2026 (the staging app is
retired) every website page template at 1440 and 390 px and 29 ERP screens were taken locally with the flag off before
and after the change, and compared pixel by pixel, and again with the new UI on. They are not committed (the
repository is public and screenshots are not source); they were delivered in the session.

The behaviour (a closed dialog leaves only an inert copy that goes within a moment, and none with the flag off; a
company switch never shows the old company's heading uncovered) is checked by `apps/work/e2e/ui-new.spec.ts`
(`npm run test:e2e:node`, run locally; the work app's end-to-end specs are not part of CI).

## Released

19 Nov 2026 with Stage 1 (kevinjogin/bizomat-site#91, deploy run 42); phases 2 to 6 on 21 Nov 2026
(kevinjogin/bizomat-site#123, deploy run 59). Both with the flag off.

## Switching it on

Only with the owner's approval (CLAUDE.md, Admin Control Centre): Control Centre, `new_ui_enabled`, a company or the
`internal` stage first, then everyone. Switching it off restores the old look at the next page load (website within a
minute).
