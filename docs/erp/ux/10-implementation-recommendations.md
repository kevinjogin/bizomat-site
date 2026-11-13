# BIZOMAT ERP: implementation recommendations

Status: for review, after the prototype. These turn the approved design into the real `/erp` application without
disturbing the working apps. Architecture context: `../architecture/03-modular-erp-architecture.md` and
`10-roadmap-and-dependencies.md`.

## 1. Build on what exists

| Recommendation | Detail |
| --- | --- |
| One React app, one more mount | Add `IS_ERP` in `apps/work/src/client/App.tsx` and an `ErpRoutes` lazy chunk; the shared sign-in pages stay as they are |
| Promote the prototype's pieces, not its data | Move the shell, navigation, widget grid, list, record, form and report components from `src/client/erp-prototype/` into `src/client/erp/`; replace the mock data modules with React Query hooks on the real APIs; delete the prototype entry afterwards |
| Reuse the existing components | `components/ui/*` (Icon, PageHeader, Modal, toasts, confirm), Finance's `sales-ui.tsx` (line editor, live preview, sharing), `StatusBadge`, `Stat`, `.data-table`; lift shared ones into `components/` when ERP needs them, without changing their behaviour |
| One set of tokens | Keep `bizomat-tokens.css` and `app.css` as the only source of colour, type and spacing; ERP-specific layout classes live in `erp.css` |
| Existing pages inside ERP | Add a link-base context and an "embedded" flag to the CRM, Finance and Project Management shells (section 3.4 of the architecture), with tests that their standalone addresses are unchanged |

## 2. Make the data layer generic early

- A list endpoint convention for every ERP module (`q`, filters as `field:op:value`, `sort`, `cursor`, `format=csv`)
  so the shared list screen needs no per-module code beyond a column definition.
- Saved views stored on the server (`erp_saved_views`: person or company, module, name, filters, sort, columns), as
  the CRM's `crm_saved_views` already does.
- Dashboard layouts stored per person and role on the server (`erp_dashboard_layouts`); the prototype's localStorage
  is only for the demonstration.
- A widget contract: `{ key, title, size, query, render }`, each widget declaring the right it needs, so the
  catalogue only offers what the person may see.

## 3. Search and My Work

- A per-module search function (CRM, Finance, Project Management already have list search) with a common result
  shape `{ type, id, number, title, status, module, url }`; ERP search calls them in process and merges.
- My Work reads, in one request: Project Management items assigned to me, CRM activities assigned to me, Finance
  documents waiting for my approval, ERP approvals and mentions. Each source keeps its own permission check.
- Counts are computed on request and cached per person for a minute.

## 4. Accessibility and quality gates

- Every new screen passes keyboard-only use, visible focus, labelled controls and AA contrast in both themes.
- A Playwright journey per stage, on desktop and a phone, as the existing `e2e/*.spec.ts` do, including the ten
  scenarios of `09-user-journeys.md` once their modules are real.
- Screens marked Planned never reach production; a module reaches the navigation only when its first release is
  approved.

## 5. Performance on the existing Machine

- Lazy-load each module's chunk; keep the shell under 150 KB of JavaScript (gzipped).
- Lists page on the server (25 to 100 rows), never load whole tables into the browser.
- Dashboard widgets query aggregates, not rows; heavy reports run in the 15-minute job and are cached as documents.
- No new dependencies unless a module cannot be built without one (charts stay small SVG components).

## 6. Rollout

1. Stage 1 behind a company setting ("Try ERP") for the owner's company first; standalone apps untouched.
2. Open to all companies after review; add ERP to the website navigation beside the existing items.
3. Only after every module the owner wants is approved: optionally make ERP the main entry in the navigation, keeping
   every standalone address working.
