# The BIZOMAT UI design system (new UI)

Owner's UI brief of 19 Nov 2026 ("BIZOMAT – UI design system and visual consistency") and the owner's decisions of the
same day: buttons 32, 40 and 48 px; the ERP on a 4 px grid; the Comfortable or Compact choice saved per user account;
the website reads the flag every minute; flags off until staging is verified.

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

- **ERP** (`apps/work/src/client/styles/ui-new.css`): buttons (sizes `.sm` 32, default and `.lg` 40, `.xl` 48;
  primary, secondary, outline, ghost, danger, link; hover lifts 1 px with a medium shadow, pressing settles, a focus
  ring from the keyboard, disabled, and `aria-busy` with a spinner), text links with an underline that fills in,
  navigation items and tabs with an indicator, inputs and selects at 40 px with the focus ring, cards (radius large, a
  small shadow, padding 24, clickable ones lift), tables (sticky header, row hover), modals, drawers, menus and toasts
  (fade and scale in; toasts bottom right), page layout, a fade between routes (`useUiRouteEffects`), a short cover when
  the company changes (`useCompanySwitchCover`), skeleton loading (`Loading` renders skeleton lines that show only under
  the new UI, the old spinner otherwise) and empty states.
- **Website** (`src/styles/ui-new.css`): the same for `.button` (40 by default, 32 small, 48 in heroes and closing calls
  to action), text links in running text (links without a class of their own, not inside `<nav>`), the site navigation,
  cards (lift when they are links), forms, menus, a page fade, one heading rhythm inside articles and legal pages, and
  one size and colour for the section label (`.bz-eyebrow`, which a section head's paragraph rule used to make as large
  as a lead).
- Only `transform`, `opacity` and `box-shadow` animate. Nothing moves under reduced motion.

## How the existing screens were converted

1. **Generated overrides** (`scripts/ui/gen-overrides.mjs`; `--check` in CI through `tests/ui-tokens.test.ts`): every
   hard-coded padding, margin, gap, font size and radius in the ERP's stylesheets, the website's stylesheets and each
   Astro component's `<style>` is put on the nearest token, under `html[data-ui="new"]` (`:global(...)` in Astro). ERP
   836 rules, website stylesheets 486, Astro components 660 (in 62 components). Rerun it after changing a stylesheet.
2. **Inline spacing in the ERP** (`scripts/ui/inline-styles.mjs`; `--check` in CI): 240 inline spacing numbers in 61
   screens became `var(--ui-sN, Npx)`: the old value while the flag is off, a token under the new UI.
3. **Shared components by hand**: `Loading`, the UI kit, the density choice, the website server.

## Density (Comfortable or Compact)

Settings, Profile, "Density" (shown when the new UI is on for the person). Saved on the account (`users.preferences_json`,
`density`), so it follows the person to every computer; it changes spacing and control heights only, never what is
shown. The theme stays a per-computer choice (CLAUDE.md, "Rules for every page").

## The UI kit

`/erp/admin/ui-kit` (platform admins; also `/tasks/admin/ui-kit` in the older console): every shared component with its
variants, sizes and states (buttons including disabled and loading, links, navigation, tabs, inputs with help and error
text, cards, badges, a table, a modal, a menu, toasts, loading and empty states), with the preview and density switches.

## What is not converted (and why)

- **Illustrations** (`src/components/visuals/*`, `*Art`, `*Illustration`, `*Visual`, `*Drawing`, `*Cover`, `*Map`,
  `*Portrait` components and `src/styles/visuals.css`): their geometry is in SVG units and must keep its finished still.
  Font sizes under 10 px anywhere are drawing labels and stay too.
- **Hairlines**: spacing of 1 to 3 px (borders, nudges) stays as it is.
- **Values already on a variable or a formula** (`var()`, `calc()`, `clamp()`, `min()`, `max()`, `em`, `%`): kept; they
  already scale.
- **Literal shadows**: 2 in the ERP and 6 on the website are not on the shadow tokens (coloured glows and inset rings
  inside components); the shadow variables they share (`--shadow-1/2/3`, `--shadow-menu`) are remapped to the tokens.
- **Computed inline geometry** in the ERP (widths, heights, positions, chart sizes): geometry, not spacing.
- **CAD Automation's own pages** (`/cad`): a separate application from kevinjogin/bizomat-cad with its own design system;
  out of scope for this flag.

## Before and after

Screenshots of every website page type (desktop and phone) and every ERP module, flag off and on, light and dark, and
Compact density, were taken locally on 19 Nov 2026 and on staging before release. They are not committed (the
repository is public and screenshots are not source).

## Switching it on

Only with the owner's approval (CLAUDE.md, Admin Control Centre): Control Centre, `new_ui_enabled`, a company or the
`internal` stage first, then everyone. Switching it off restores the old look at the next page load (website within a
minute).
