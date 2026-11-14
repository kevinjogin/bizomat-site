# BIZOMAT System (formerly ERP): clickable preview guide

Status: design work only. The prototype runs on demonstration data in the browser. It makes no server calls, has no
sign-in, and changes no existing screen of Project Management, the Customer Relationship Management (CRM), Finance or
Company. Every screen carries the banner "Design prototype: demonstration data, not connected to BIZOMAT." Since
14 Nov 2026 (owner's decision) it is published at `https://bizomat.ai/system-preview/` for review (section 1a).

## 1. Run it

From `apps/work` (after `npm ci`):

| Purpose | Command | Address |
| --- | --- | --- |
| Develop (hot reload) | `npm run dev:system-preview` | http://localhost:5174/system-preview/ |
| Build static files | `npm run build:system-preview` | writes `dist/system-preview/` |
| Look at the build | `npx vite preview --config vite.system-preview.config.ts` | http://localhost:4174/system-preview/ |
| Any static server | for example `python3 -m http.server 8099` in `dist` | http://localhost:8099/system-preview/ |

The build uses relative addresses (`base: './'`) and hash routes (`#/procurement/purchase-orders`), so the folder
works from any path on any static server. Browsers do not run module scripts from `file://`, so open it through a
server. Fonts and the favicon come from the app's `public/` folder; Vite rewrites the tokens' `/fonts/...` addresses
to `../fonts/...` beside the `assets` folder, so no prototype-specific font rule is needed.

The app's own build is untouched: `npm run build:client` still uses `vite.config.ts` with `index.html`, and its
output in `dist/client` contains nothing from the prototype (checked by searching the output for the prototype's
banner and class names).

Checks used during the work (the same as the app's): `npx tsc -p tsconfig.json --noEmit` and
`npx eslint src/client/system-prototype vite.system-preview.config.ts`.

## 1a. Published on bizomat.ai

The owner asked on 14 Nov 2026 for the prototype to be on bizomat.ai. It is at `https://bizomat.ai/system-preview/`,
with no new app, Machine, process or route:

- **Build:** `infrastructure/fly/Dockerfile`, stage `system-preview`, runs `npm run build:system-preview` from the work app's
  sources. The final image copies `dist/system-preview` into the website's static folder
  (`/app/web/dist/system-preview`). The work app's build and its image folder do not change, and the website's own
  build (`npm run build`) does not include it.
- **Serving:** the web Machine serves the files as it serves the website, under the website's headers, including its
  strict Content-Security-Policy. Before release, every screen was walked in a browser under that policy (desktop,
  phone and the dark theme), with no policy violation, script error or failed request.
- **Out of search:** `scripts/postbuild.mjs` adds `X-Robots-Tag: noindex, nofollow` for `/system-preview/*`, and
  the page has `robots: noindex, nofollow`. It is not in the sitemap, the site search or the navigation.
- **Checks:** the smoke test (`infrastructure/smoke/smoke.mjs`) checks the page, the header and its script. In the image
  (CI, the compose stack) a 404 fails; against a site deployed before it, a 404 only warns.
- **What it is not:** the banner on every screen says so; the companies, people and figures are fictional examples.
  It is not a product claim: ERP is not built (`docs/erp/README.md`).
- **Removing it:** delete the `system-preview` stage and its `COPY` line in the Dockerfile, then run the deploy workflow.

## 1b. CAD Automation in the System

The owner asked on 14 Nov 2026 for CAD Automation to be part of the System, with the same connector and style and a
clearer setup. The section **CAD Automation** (`pages/cad.tsx`, data in `data/operations.ts`) has:

| Page | What it shows |
| --- | --- |
| Overview | Computers online, AI connectors, jobs in progress, setup progress; computers and recent jobs |
| Set up | The four steps of CAD Automation's own setup in one place: install for SOLIDWORKS (the real installer link), pair the computer, connect the AI assistant (the real connector address `https://bizomat.ai/cad/mcp` and the same steps for Claude, ChatGPT and other MCP apps), check it works (two requests to copy); progress kept on the computer |
| Computers | Each paired computer: person, status, SOLIDWORKS, add-in version (update available), what is open, last seen |
| AI connectors | Connected assistants, and the connector address with the steps to add one |
| Jobs | CAD jobs (moved here from Products & Engineering; drawings stay there) |

A "CAD Automation" tile is on the Home of the CEO, executive, engineer and administrator roles. What stays the same:
CAD Automation is still an MCP connector, with the same Windows installer, SOLIDWORKS add-in, Companion and connector
address, at `bizomat.ai/cad`. The figures are demonstration data until CAD Automation shares its own (planned: one BIZOMAT
sign-in for CAD Automation, then a status interface for computers and jobs).

The old address `/erp-design-preview/` answers 301 to `/system-preview/` (`public/_redirects`).

## 2. Where the files are

| Path (under `apps/work`) | What |
| --- | --- |
| `system-preview/index.html` | Entry page: title "BIZOMAT System preview", `robots: noindex, nofollow` |
| `vite.system-preview.config.ts` | Build of the prototype only; output `dist/system-preview` |
| `package.json` | Two scripts: `dev:system-preview`, `build:system-preview` (the only change to an existing file) |
| `src/client/system-prototype/main.tsx` | Starts the app: theme (system by default, key `bizomat-theme`), toasts, state, router |
| `App.tsx` | Hash routes and the page registry (which page uses a custom screen) |
| `nav.ts` | The navigation map, page states, real addresses ("Open in Finance") and the role table |
| `state.tsx` | Role, company, site, favourites, recent pages, sidebar, My Work, notifications, record changes |
| `registry.tsx` | Every kind of record: list columns, saved views, record tabs, related records, actions, approval steps, create form |
| `types.ts`, `format.ts`, `icons.tsx`, `kit.tsx`, `links.tsx` | Types, formatting and helpers, extra icons, small components (menus, badges, tabs, drawer), record links |
| `data/core.ts`, `data/sales-finance.ts`, `data/operations.ts`, `data/work.ts` | Demonstration data |
| `shell/` | `Shell.tsx` (banner, header, sidebar, bottom bar), `PageHeader.tsx`, `Search.tsx`, `Notifications.tsx`, `Journeys.tsx` |
| `patterns/` | `ListView.tsx`, `RecordView.tsx`, `FormView.tsx`, `Approval.tsx`, `ReportView.tsx` |
| `widgets/` | `charts.tsx` (SVG charts), `catalog.tsx` (widget catalogue and the twelve role layouts), `Dashboard.tsx` (Home and the customiser) |
| `pages/` | `MyWork.tsx`, `common.tsx`, `recordParts.tsx` (record-specific content), `modules.tsx`, `reports.tsx`, `admin.tsx`, `mobile.tsx` |
| `erp.css` | The prototype's layout classes (`erp-*`) on the app's tokens and components |

The prototype reuses, without changing them: `styles/app.css` (and through it `bizomat-tokens.css`),
`components/ui/Icon.tsx` (`Icon`, `BrandMark`, `Wordmark`), `components/ui/overlays.tsx` (`Modal`, `Popover`,
`ToastProvider`), `lib/hooks.ts` (theme and keyboard helpers). No new npm dependency; routing uses
`react-router-dom`'s `createHashRouter`.

## 3. What is mocked

| Area | In the prototype | In BIZOMAT |
| --- | --- | --- |
| Data | Fixed, fictional records ("Example Engineering Pty Ltd", sites Brisbane and Sydney; "Harbour Builders"; "Coastline Steel Supply"). Today is fixed at 13 Nov 2026 so the story stays the same. | Each module's own API and permissions |
| Changes | Approve, Return, Complete, record payment, save a form, move a card: kept in memory for the visit, with Undo | Saved by the owning module |
| Kept on this computer | Role, company, site, favourites, recent pages, sidebar collapse, dashboard layouts per role, saved views, saved reports, recent searches (`localStorage` keys starting `bizomat-system-prototype:`); theme (`bizomat-theme`, shared with BIZOMAT) | Layouts and views saved on the account |
| Working pages | A representative mock of the existing screen, the route it opens and "Open in <app>" to the real address (for example https://bizomat.ai/finance/); the prototype never calls it | The existing screen inside the ERP shell |
| Sign-in, Sign out | None; Sign out says so | BIZOMAT session cookie |
| Search | Searches the demonstration records and page names | Each module answers from its own search |
| Export | Downloads a CSV of the demonstration rows | Same, from real data |
| Camera, upload, email | Placeholders that say nothing is sent | Later stages |

## 4. How it maps to the information architecture

`02-information-architecture.md` is followed as written:

| Information architecture | Prototype |
| --- | --- |
| Section 2, shell anatomy | `shell/Shell.tsx`; breadcrumbs in `shell/PageHeader.tsx` |
| Section 3, navigation map and states | `nav.ts` (`SECTIONS`); every page has its W, C or P state in the sidebar and page header |
| Section 4, routes | `#/` for Home, `#/my-work`, `#/<section>/<page>`, `#/<section>/<page>/<record>`, `#/<section>/<page>/new`; product data under `#/products/...`, changes, drawings and CAD jobs under `#/engineering/...` |
| Section 5, roles and dashboards | `nav.ts` (`ROLES`, `visibleSections`); `widgets/catalog.tsx` (`DEFAULT_LAYOUTS`); role switch in the user menu and on Home |
| Section 6, My Work | `pages/MyWork.tsx`, items in `data/work.ts` |
| Section 7, search and quick create | `shell/Search.tsx`; New menu in `shell/Shell.tsx` |
| Section 8, ten scenarios | `shell/Journeys.tsx` (Help, Guided journeys); steps and click counts in `09-user-journeys.md` |
| `04-role-dashboards.md` | Same widgets and layouts; the 12-column grid is drawn as four tracks (S, M, L, F = 1, 2, 3, 4 tracks) |
| `05-reusable-screens.md` | `patterns/` |

## 5. Screens checked

The ten scenarios were walked by clicking in a headless browser with no console errors, and the main screens were
captured at 1440 × 900, 900 × 1100 and 390 × 844 in light and dark themes (the scripts and pictures are kept outside
the repository). Keyboard checks covered the menus, tabs, search, the skip link and the dashboard customiser without a
mouse.

## 6. Remove it

Delete `apps/work/src/client/system-prototype/`, `apps/work/system-preview/` and `apps/work/vite.system-preview.config.ts`,
and the two `*:system-preview` scripts in `apps/work/package.json`. Nothing else refers to them.

## 7. Evolve it into the real `/erp` mount

1. **Mount.** Add `/erp` to the work app's `MOUNTS` (as `/crm`, `/finance` and `/company`), with an `ErpApp` route tree
   under the shared `BrowserRouter` and `SessionProvider`. Change `createHashRouter` to the app's router; the
   prototype's paths stay the same without the `#`.
2. **Keep the shell, patterns and widgets.** `shell/`, `patterns/`, `widgets/charts.tsx` and `kit.tsx` have no data
   dependencies; they move as they are. Replace the banner with nothing (or a "Preview" badge for planned modules).
3. **Swap the data layer.** Replace `data/*` and the `rows` of `registry.tsx` with React Query hooks per module
   (`useRows(key)` and `useRecord(key, id)` are the only read paths, so the screens do not change). Approve, Complete
   and the forms call the owning module's API; Undo becomes a reverse call or is dropped where it cannot be undone.
4. **Working pages.** Render the existing CRM, Finance and Project Management routes inside the shell instead of the
   mock lists; keep "Open in <app>".
5. **Server checks.** Role visibility in `nav.ts` stays a convenience; every module keeps checking every record.
6. **Saved state.** Move layouts, views, favourites and saved reports from `localStorage` to the account (theme stays
   on the computer, the BIZOMAT rule).
7. **CSP.** The prototype sets a few CSS custom properties from code (bar widths and positions); the app does this
   through the CSSOM, which its Content Security Policy allows. Keep `style=""` out of server-rendered HTML.
8. **Tests.** Turn the ten scenarios into Playwright tests (`apps/work/e2e`) as each module becomes real.
