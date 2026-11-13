# BIZOMAT ERP: clickable prototype guide

Status: design work only. The prototype runs on demonstration data in the browser. It makes no server calls, has no
sign-in, is not deployed, and changes no existing screen of Project Management, the Customer Relationship Management
(CRM), Finance or Company. Every screen carries the banner "Design prototype: demonstration data, not connected to
BIZOMAT."

## 1. Run it

From `apps/work` (after `npm ci`):

| Purpose | Command | Address |
| --- | --- | --- |
| Develop (hot reload) | `npm run dev:erp-preview` | http://localhost:5174/erp-design-preview/ |
| Build static files | `npm run build:erp-preview` | writes `dist/erp-design-preview/` |
| Look at the build | `npx vite preview --config vite.erp-preview.config.ts` | http://localhost:4174/erp-design-preview/ |
| Any static server | for example `python3 -m http.server 8099` in `dist` | http://localhost:8099/erp-design-preview/ |

The build uses relative addresses (`base: './'`) and hash routes (`#/procurement/purchase-orders`), so the folder
works from any path on any static server. Browsers do not run module scripts from `file://`, so open it through a
server. Fonts and the favicon come from the app's `public/` folder; Vite rewrites the tokens' `/fonts/...` addresses
to `../fonts/...` beside the `assets` folder, so no prototype-specific font rule is needed.

The app's own build is untouched: `npm run build:client` still uses `vite.config.ts` with `index.html`, and its
output in `dist/client` contains nothing from the prototype (checked by searching the output for the prototype's
banner and class names).

Checks used during the work (the same as the app's): `npx tsc -p tsconfig.json --noEmit` and
`npx eslint src/client/erp-prototype vite.erp-preview.config.ts`.

## 2. Where the files are

| Path (under `apps/work`) | What |
| --- | --- |
| `erp-design-preview/index.html` | Entry page: title "BIZOMAT ERP design prototype", `robots: noindex, nofollow` |
| `vite.erp-preview.config.ts` | Build of the prototype only; output `dist/erp-design-preview` |
| `package.json` | Two scripts: `dev:erp-preview`, `build:erp-preview` (the only change to an existing file) |
| `src/client/erp-prototype/main.tsx` | Starts the app: theme (system by default, key `bizomat-theme`), toasts, state, router |
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
| Kept on this computer | Role, company, site, favourites, recent pages, sidebar collapse, dashboard layouts per role, saved views, saved reports, recent searches (`localStorage` keys starting `bizomat-erp-prototype:`); theme (`bizomat-theme`, shared with BIZOMAT) | Layouts and views saved on the account |
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

Delete `apps/work/src/client/erp-prototype/`, `apps/work/erp-design-preview/` and `apps/work/vite.erp-preview.config.ts`,
and the two `*:erp-preview` scripts in `apps/work/package.json`. Nothing else refers to them.

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
