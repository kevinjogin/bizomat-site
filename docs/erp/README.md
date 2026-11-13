# BIZOMAT ERP: Phase 0 blueprint and UX design

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
| 8 | Clickable prototype | `ux/08-prototype-guide.md`, code in `apps/work/src/client/erp-prototype/` |
| 9 | User journey demonstrations | `ux/09-user-journeys.md` |
| 10 | Implementation recommendations | `ux/10-implementation-recommendations.md` |

The prototype uses demonstration data only, never calls a BIZOMAT API, is built by its own Vite config and is not part
of the production build or deployment.
