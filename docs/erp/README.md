# BIZOMAT System (formerly ERP): Phase 0 blueprint and UX design

**Name (owner, 14 Nov 2026):** the planned ERP is now called **BIZOMAT System**, to feel like one complete system rather
than a module set. These documents keep "ERP" as their working name for the planned modules and their tables
(`erp_*`); the preview and everything people see say BIZOMAT System. The real application is live at `/system`
(14 Nov 2026, `docs/system/README.md`): every tool by company, CAD Automation and the super admin console. The
operations modules planned here are not built yet.
CAD Automation is part of the System as its own section (Overview, Set up, Computers, AI connectors, Jobs): it stays an
MCP connector with the same installer, add-in and Companion, and the System shows its setup and status beside the rest.

Owner's briefs of 13 Nov 2026: "Phase 0: discovery and design only" and "Enterprise UI/UX design and interactive
prototype". A third brief ("Integrated application development") follows **only after this blueprint and the design
are reviewed and approved**. Nothing in this folder is production code, and nothing here changes a working
application.

**In one paragraph.** BIZOMAT already runs Project Management, Customer Relationship Management, Finance and Company
accounts in one application (`apps/work`, one database, one sign-in, one Fly Machine), and CAD Automation as a
separate app. ERP becomes a fifth area of that same application at `bizomat.ai/erp`, with its own shell, navigation,
dashboards and new modules (products and engineering, procurement, inventory, manufacturing, quality, maintenance,
supply chain, enterprise reporting), stored in new `erp_*` tables in the same database and working through the
existing modules rather than copying them. No new Fly app, Machine, server, database or login.

## Discovery (what exists today)

| File | Scope |
| --- | --- |
| `discovery/work-app.md` | Project Management, Task Management, the CRM, Finance and Company: architecture, routes, tables, tenancy, sign-in, permissions, integration points |
| `discovery/cad-automation.md` | CAD Automation and its SolidWorks MCP: components, tools, data, accounts, deployment, integration points |
| `discovery/website-and-infrastructure.md` | The website, AI Search, Engine Room, Resources, the edge proxy, Fly.io, CI and capacity |

## Architecture (Phase 0 deliverables)

| # | Deliverable | File |
| --- | --- | --- |
| 1 | Existing system discovery report | `architecture/01-existing-system-discovery.md` |
| 2 | Existing module and feature inventory | `architecture/02-module-feature-inventory.md` |
| 3 | Proposed modular ERP architecture | `architecture/03-modular-erp-architecture.md` |
| 4 | Master data ownership matrix | `architecture/04-master-data-ownership.md` |
| 5 | Database entity relationship diagram | `architecture/05-entity-relationship-design.md` |
| 6 | Cross-module API and integration specification | `architecture/06-integration-specification.md` |
| 7 | User roles and permission matrix (with security and data integrity) | `architecture/07-roles-and-permissions.md` |
| 8 | ERP navigation and screen structure | `architecture/08-navigation-and-screens.md` |
| 9 | Complete ERP feature matrix | `architecture/09-feature-matrix.md` |
| 10 | Development roadmap and dependencies | `architecture/10-roadmap-and-dependencies.md` |
| 11 | Testing and migration strategy | `architecture/11-testing-and-migration-strategy.md` |
| 12 | Deployment and infrastructure strategy | `architecture/12-deployment-and-infrastructure.md` |
| 13 | Enterprise capability matrix (16 domains, 259 features with status; public source `src/data/erp-capabilities.ts`) | `architecture/13-enterprise-capability-matrix.md` |
| 14 | Application integration map | `architecture/14-application-integration-map.md` |
| 15 | ERP roadmap (stages S1 to S13, maintenance M1 to M4) | `architecture/15-erp-roadmap-2026.md` |

## UX design (design brief deliverables)

| # | Deliverable | File |
| --- | --- | --- |
| 1 | UX specification | `ux/01-ux-specification.md` |
| 2 | Information architecture | `ux/02-information-architecture.md` |
| 3 | Navigation map | `ux/02-information-architecture.md` (section 3) |
| 4 | Role-based dashboard designs | `ux/04-role-dashboards.md` |
| 5 | Reusable screen designs | `ux/05-reusable-screens.md` |
| 6 | Design system and component library | `ux/06-design-system.md` |
| 7 | Responsive layouts | `ux/07-responsive-layouts.md` |
| 8 | Clickable prototype | `ux/08-prototype-guide.md`, code in `apps/work/src/client/system-prototype/` |
| 9 | User journey demonstrations | `ux/09-user-journeys.md` |
| 10 | Implementation recommendations | `ux/10-implementation-recommendations.md` |
| 11 | Enterprise workspace update (the live `/erp`) | `ux/11-enterprise-workspace-update.md` |

The prototype uses demonstration data only, never calls a BIZOMAT API and is built by its own Vite config. It was
published for review at `https://bizomat.ai/system-preview/` on 14 Nov 2026 and retired the same day (owner: no links
to previews or demos): it is no longer built into the image, and its addresses answer 301 to `/systems/erp/`. Its
source stays here as design history (`npm run build:system-preview` in `apps/work` builds it locally).
