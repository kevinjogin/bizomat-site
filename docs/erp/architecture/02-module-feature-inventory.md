# 2. Existing module and feature inventory

Status: what works today, 13 Nov 2026. Complete lists with file references: `../discovery/work-app.md` section 8,
`../discovery/cad-automation.md` section 9, `../discovery/website-and-infrastructure.md` sections 1 to 3. This page
maps that inventory onto the ERP sections it will serve, so nothing is rebuilt.

## 2.1 Inventory by ERP section

| ERP section | Existing module | Working features (summary) | Reused as |
| --- | --- | --- | --- |
| Sales & Customers | CRM | Contacts, companies, leads with scoring and conversion, several pipelines with custom stages, deals with products, activities with calendar and feeds, unified timeline, notes and documents, 11 reports, saved views, CSV import and export, automations, email templates, in-app and email notifications | Customers, contacts, leads, opportunities, activities, sales reports |
| Sales & Customers | Finance | Quotes with versions as sent, online acceptance, expiry, progress invoicing; customers (Finance contacts) | Quotations; source of sales orders |
| Finance | Finance | Personal, household and business workspaces; chart of accounts; tax codes with BAS labels; tracking; double-entry ledger with database-enforced integrity; transactions with splits and approvals; statement import (CSV, OFX, QIF), matching, rules, reconciliation; invoices, credit notes, bills, purchase orders, expense claims, payments; document templates and live preview; secure online links and email; budgets, goals, recurring records; 12 reports with CSV and PDF; GST worksheet; period lock; audit | Finance & Accounting section as is; the ledger behind every ERP journal |
| Projects & Tasks | Project Management | Workspaces, boards from templates, groups, 25 column types, formulas, nine view types, dependencies, CPM scheduling, baselines, earned value, time and cost entries, project reports (PDF, XLSX, HTML, CSV), dashboards, documents with versions, goals, automations, webhooks, Slack and Teams, realtime boards, My Work, My Day, inbox | Projects, tasks, teams, schedule; destination for ERP tasks |
| Administration | Company | Verified company registration, people with a role in each tool, invitations, departments in every tool, overview totals, links between tools, project costs page, activity log, BIZOMAT sign-in provider | Company, people, departments, tools; extended with sites, legal entities, module access |
| Administration | Platform admin | Founder console, CRM and Finance consoles (counts, health, support actions) | Platform administration (not company administration) |
| Products & Engineering | CAD Automation | 31 MCP tools: connection and documents, parts, assemblies, checking and measuring, drawings (create, read, edit), files (import, export to STEP, STL, PDF, DWG, DXF), computers and commands; SOLIDWORKS add-in and Companion; OAuth for AI apps | Engineering automation, called for the engineer |
| Reports & Analytics | Finance, CRM, Project Management | Their reports and dashboards | Opened from Reports & Analytics; enterprise reports are new |
| Public site | Website | Product pages, user guides, AI Search (static index, optional AI term expansion), Engine Room, Resources (tools and Library) | Stays public; ERP gets a navigation entry when approved |

## 2.2 Gaps the ERP fills (nothing here exists today)

- Product master, variants, revisions, BOMs, routings, work centres, engineering changes.
- Requisitions, requests for quotation, supplier profiles, receiving against purchase orders, three-way match.
- Warehouses, locations, stock moves, stock on hand, lots and serials, counts, inventory valuation.
- Sales orders, deliveries, shipments, carriers, returns.
- Work orders, operations reporting, production planning, shop floor.
- Inspection plans, inspections, nonconformances, corrective actions.
- Assets, maintenance plans and orders, downtime.
- Enterprise dashboards and reports across modules; one My Work, one search and one notification centre across tools.
- Sites and branches, legal entities, module-level access and role templates, an approval engine for ERP records.

## 2.3 Overlaps to manage (decided in `04-master-data-ownership.md`)

| Overlap | Resolution |
| --- | --- |
| CRM product catalogue vs an ERP product master | ERP master; CRM products link to it |
| Finance purchase orders vs ERP procurement | Finance keeps the PO document; ERP extends it |
| Finance contacts as suppliers vs ERP supplier management | Finance contact plus ERP supplier profile |
| CRM companies vs Finance contacts as customers | Already linked once (`co_customer_links`) |
| Project Management "My Work" vs ERP My Work | ERP My Work reads Project Management's (and the others') |
| Three team systems and four invitation tables | Company departments and invitations drive them today; ERP uses the company layer |
