// The BIZOMAT platform catalogue: public facts about the two applications and the website's own sections.
//
// One source for the product pages (/cad-automation/, /work/, /crm-platform/ and its guide), the homepage cards, the Engine Room (/engine-room/) and the AI search index
// (/discovery-index.json "pages"). Every entry is PUBLIC: product descriptions, documentation and page addresses.
// Nothing here comes from, or points into, a customer's projects, files or account, so search over it cannot reveal
// private data. Every capability is taken from the applications' own code and documentation in this repository:
//   CAD Automation:      apps/cad/opensketch/site.py (claims checked against sw_tools.py, the feature registry,
//                        auth.py, mcpauth.py, devicebridge.py), apps/cad/opensketch/catalog.py, apps/cad/docs/
//   Project Management:  apps/work/README.md (feature table), apps/work/ARCHITECTURE.md, apps/work/src/shared/columns.ts
//   Customer Relationship Management (CRM): apps/work/src/shared/crm/ (roles.ts, defaults.ts, fields.ts, automations.ts),
//                        apps/work/src/worker/crm/routes-insights.ts (REPORTS), docs/crm/README.md
// Keep it that way: when a capability changes in an app, change it here in the same commit.
import { APP_LINKS } from '../config/platform.ts';

export type PlatformArea = 'CAD Automation' | 'Project Management' | 'Customer Relationship Management' | 'Resources' | 'BIZOMAT';
export type PlatformKind = 'Product' | 'Capability' | 'Documentation' | 'Integration' | 'Page';

export interface PlatformEntry {
  id: string;
  title: string;
  summary: string;
  url: string;
  area: PlatformArea;
  kind: PlatformKind;
  /** Search-only words: what people type when they are looking for this. */
  keywords: string;
}

// ---------- CAD Automation (formerly CADOS) ----------
export const CAD = {
  name: 'CAD Automation',
  formerly: 'CADOS',
  headline: 'Your AI assistant, working in SOLIDWORKS on your own computer.',
  summary:
    'BIZOMAT CAD Automation connects Claude, ChatGPT or another assistant that supports MCP connectors to SOLIDWORKS on your PC. You describe the part, the change or the check; it builds native, editable features in your own files.',
  /** 30 SOLIDWORKS tools plus request_upload (apps/cad/opensketch/mcp_server.py; tests/test_app_pages.py keeps it equal). */
  toolCount: 31,
  capabilities: [
    { title: 'Parts', text: 'Sketches with relations and dimensions, solved before they reach SOLIDWORKS; over-defined sketches are refused. Extrude, revolve, sweep, loft, hole, fillet, chamfer, shell, draft, mirror, patterns and reference planes.' },
    { title: 'Assemblies', text: 'Insert components, add mates, find mate candidates and check interference. ISO screws, nuts, washers and ball bearings made to size.' },
    { title: 'Drawings', text: 'Native .SLDDRW drawings with standard or named views, preferred scales, model dimensions and title block fields. Section, detail and projected views, notes and a bill of materials.' },
    { title: 'Your existing files', text: 'Open your own parts and assemblies, read features, dimensions and topology, change parameters and equations, measure and preview.' },
    { title: 'Import and export', text: 'Open STEP, IGES and Parasolid files. Export STEP, STL, Parasolid or IGES, and drawings as PDF (every sheet), DWG or DXF.' },
    { title: 'Checks before changes', text: 'Every feature is rebuilt on an OpenCascade kernel first, so the expected volume and size are known before SOLIDWORKS is touched. Deletions ask you to confirm on your computer.' },
  ],
  steps: [
    { title: 'Install on Windows', text: 'One installer adds the SOLIDWORKS add-in and the BIZOMAT Companion, a small tray app that starts with Windows.' },
    { title: 'Pair the computer', text: 'Sign in once from the Companion. The computer gets its own key, kept in Windows and never exported.' },
    { title: 'Connect your assistant', text: 'Add the connector address in Claude, ChatGPT or another MCP app and sign in. The assistant now has the SOLIDWORKS tools.' },
    { title: 'Ask in plain language', text: 'Describe the work. Each command goes over an outgoing HTTPS link to your computer and runs in your SOLIDWORKS session.' },
  ],
  status:
    'Automated tests cover every SOLIDWORKS tool through a simulated SOLIDWORKS and the real Windows Companion link against the real server. Field testing of the installed product on Windows with SOLIDWORKS 2022 is the next milestone.',
} as const;

// ---------- Project Management (formerly KEVOS Work) ----------
export const WORK = {
  name: 'Project Management',
  formerly: 'KEVOS Work',
  headline: 'Projects, tasks and teams in one shared workspace.',
  summary:
    'BIZOMAT Project Management brings your projects, tasks, documents and dashboards into one place. Plan the work, assign it, track progress and automate the routine steps.',
  views: ['Table', 'Kanban', 'Calendar', 'Timeline and Gantt', 'Chart', 'Workload', 'Form', 'Map', 'Files'],
  columnTypes: 25,
  widgetTypes: 11,
  capabilities: [
    { title: 'Boards for every project', text: 'Groups, items and subitems with 25 column types: status, people, dates, timelines, numbers, formulas, files and more. Inline editing, drag and drop, bulk actions, templates.' },
    { title: 'Nine views of the same work', text: 'Table, Kanban, Calendar, Timeline and Gantt with dependencies and milestones, Chart, Workload, Form, Map and Files, all on one shared data model.' },
    { title: 'Teams and permissions', text: 'Workspaces with owner, admin, member and viewer roles, teams, invitations, private or shared boards, board roles and an audit log.' },
    { title: 'Collaboration', text: 'Updates and replies with @mentions, attachments, activity history, time tracking and linked documents on every item.' },
    { title: 'Automations', text: 'Trigger, conditions, actions: status changes, dates and schedules start work for you, with run logs, retries and loop prevention.' },
    { title: 'Dashboards, documents and goals', text: 'Eleven live widget types, rich-text documents with version history and comments, goals, My Work, My Day and a weekly planner.' },
  ],
  integrations: 'Signed outgoing webhooks and incoming webhooks for Slack and Microsoft Teams. Personal API tokens. Google sign-in when it is configured.',
} as const;

// ---------- Customer Relationship Management (CRM, 13 Nov 2026) ----------
// Served by the Project Management application at bizomat.ai/crm, with the same accounts. tests/platform-catalog.test.ts
// compares the lists below with the application's code.
export const CRM = {
  name: 'Customer Relationship Management',
  short: 'CRM',
  headline: 'Customers, leads and deals, managed with your team.',
  summary:
    'BIZOMAT Customer Relationship Management (CRM) keeps your contacts, companies, leads, deals and follow-ups in one shared place. Work your pipeline on a board, plan every activity and see what is closing from live reports.',
  capabilities: [
    { title: 'Contacts and companies', text: 'Everyone you deal with and the businesses they work for: several emails and phone numbers, tags, custom fields, pictures and logos, and a warning before you add a duplicate.' },
    { title: 'Leads you can qualify', text: 'Statuses from New to Converted, a lead score that explains itself, and conversion into a contact, a company and a deal in one step.' },
    { title: 'Pipelines and deals', text: 'Your own pipelines, stages and probabilities. A board you drag deals across, Won and Lost, products and services on each deal, and its stage history.' },
    { title: 'Activities and follow-ups', text: 'Calls, emails, meetings, visits, demonstrations, tasks and more, assigned with a due date and priority, on lists, a calendar and your own calendar app.' },
    { title: 'Dashboard and reports', text: 'Open pipeline, weighted forecast, win rate and overdue follow-ups at a glance, and eleven reports with a chart, a table and CSV export.' },
    { title: 'Automations', text: 'Seven ready-made automations in every new organisation, and your own: a trigger, conditions and actions such as notify, create a follow-up or flag a deal.' },
  ],
  roles: [
    { name: 'Owner', text: 'Everything, including handing over ownership and deleting the organisation. Each organisation has exactly one.' },
    { name: 'Administrator', text: 'Everything else: members, roles, permissions, settings and every record.' },
    { name: 'Manager', text: 'All records, pipelines, fields, lists, products, automations and teams. Invites people but does not change roles.' },
    { name: 'Sales Executive', text: 'Sees all records and adds new ones; edits and deletes the records they own; sees reports. No import or export.' },
    { name: 'Member', text: 'Sees all records, adds new ones and edits the ones they own. Never deletes.' },
    { name: 'Viewer', text: 'Reads everything their organisation allows, and changes nothing.' },
  ],
  /** The pipeline a new organisation starts with (apps/work/src/shared/crm/defaults.ts, DEFAULT_PIPELINE). */
  stages: [
    { name: 'Qualification', probability: 10 },
    { name: 'Needs analysis', probability: 25 },
    { name: 'Proposal', probability: 50 },
    { name: 'Negotiation', probability: 75 },
    { name: 'Contract sent', probability: 90 },
  ],
  leadStatuses: ['New', 'Contacted', 'Engaged', 'Qualified', 'Unqualified', 'Converted'],
  activityTypes: ['Call', 'Email', 'Meeting', 'Appointment', 'Follow-up', 'Presentation', 'Demonstration', 'Proposal', 'Customer visit', 'Task', 'General'],
  /** Custom field types, as the application labels them (CUSTOM_FIELD_TYPE_LABELS). */
  customFieldTypes: ['Text', 'Long text', 'Number', 'Amount', 'Date', 'Dropdown', 'Multiple choice', 'Checkbox', 'Web address', 'Email', 'Phone'],
  reports: ['Lead conversion', 'Sales pipeline', 'Revenue', 'Won and lost deals', 'Salesperson performance', 'Lead source performance', 'Activities', 'Monthly and quarterly trends', 'Forecast revenue', 'Deal ageing', 'Sales cycle duration'],
  /** The automations every new organisation starts with (PRESETS). */
  automations: [
    'Tell the owner about a new lead',
    'Remind about overdue follow-ups',
    'Tell managers when a high-value deal moves',
    'Follow up after a proposal',
    'Tell people about tasks assigned to them',
    'Flag deals close to their expected close date',
    'Tell the team when a deal is won or lost',
  ],
  integrations: 'Email logging from your own mail program, a calendar file for every activity and a private calendar subscription, CSV import and export, and tasks in Project Management.',
} as const;

// ---------- Resources (formerly kevos.com Tools and Library) ----------
export const RESOURCES = {
  name: 'Resources',
  headline: 'Calculators, tools, books and guides. Free, without an account.',
  summary:
    'Engineering, manufacturing, operations and business calculators that show their method, a technical library of books in short chapters, longer guides and learning paths.',
} as const;

const C = 'CAD Automation';
const W = 'Project Management';
const M = 'Customer Relationship Management';
const R = 'Resources';
const P = 'BIZOMAT';

export const PLATFORM_CATALOG: readonly PlatformEntry[] = [
  // CAD Automation
  { id: 'page:cad', title: 'BIZOMAT CAD Automation', summary: CAD.summary, url: '/cad-automation/', area: C, kind: 'Product',
    keywords: 'solidworks automation automate cad design engineering automation ai assistant claude chatgpt mcp connector parts assemblies drawings model modelling 3d cados' },
  { id: 'page:cad-how', title: 'How CAD Automation connects your AI assistant to SOLIDWORKS', summary: 'Your assistant calls the MCP tools; BIZOMAT checks each step and sends it over an outgoing HTTPS link to the Companion and add-in on your computer, where SOLIDWORKS does the work.', url: '/cad-automation/#how', area: C, kind: 'Capability',
    keywords: 'mcp model context protocol connector add-in addin companion windows local execution outbound https pairing architecture how it works connect' },
  { id: 'page:cad-capabilities', title: 'CAD Automation capabilities: parts, assemblies and drawings', summary: 'Sketches, extrudes, revolves, holes, fillets, patterns, mates, interference checks, native drawings with section and detail views, a bill of materials, STEP, IGES and Parasolid import, and STEP, STL, PDF, DWG and DXF export.', url: '/cad-automation/#capabilities', area: C, kind: 'Capability',
    keywords: 'sketch extrude revolve sweep loft fillet chamfer hole pattern mirror shell draft mate interference drawing slddrw section view detail view bill of materials bom pdf dwg dxf step stl iges parasolid import export equations parameters dimensions fasteners screws bearings' },
  { id: 'page:cad-install', title: 'Install CAD Automation for SOLIDWORKS', summary: 'One Windows installer adds the add-in and the Companion. Pair the computer, add the connector to your assistant, then run the self test.', url: '/cad-automation/#install', area: C, kind: 'Documentation',
    keywords: 'install installation setup msi installer download windows pair pairing computer self test getting started configure configuration' },
  { id: 'page:cad-tools', title: 'The CAD Automation tool list', summary: `All ${CAD.toolCount} tools an assistant can call, from sw_status and sw_batch to sw_create_drawing and sw_check_interference.`, url: '/cad-automation/#tools', area: C, kind: 'Documentation',
    keywords: 'tools commands operations sw_status sw_batch sw_add_features sw_create_drawing sw_export sw_import sw_selftest api list supported commands' },
  { id: 'page:cad-security', title: 'CAD Automation security', summary: 'Signed commands, a key per computer, sign-in for every AI app, confirmation before deletions, and your model files stay on your computer.', url: '/cad-automation/#security', area: C, kind: 'Capability',
    keywords: 'security signed commands device key oauth sign-in privacy local files confirmation permissions' },
  { id: 'doc:cad', title: 'CAD Automation documentation', summary: 'Set-up, connection, sign-in for AI apps, the self test, troubleshooting and security, in the application itself.', url: APP_LINKS.cad.docs, area: C, kind: 'Documentation',
    keywords: 'documentation docs guide help troubleshooting connector address oauth self test faq manual' },
  { id: 'int:mcp', title: 'Integrations: Claude, ChatGPT and other MCP apps', summary: 'CAD Automation works with any assistant that supports remote MCP servers over Streamable HTTP: add the connector address and sign in.', url: '/cad-automation/#how', area: C, kind: 'Integration',
    keywords: 'integration integrations claude chatgpt mcp clients streamable http connector oauth ai apps assistant cursor' },
  { id: 'int:solidworks', title: 'Integration: SOLIDWORKS', summary: 'A native SOLIDWORKS add-in (Tools > Add-Ins) with a tab, menu and task pane, built against the SOLIDWORKS 2022 API.', url: '/cad-automation/#how', area: C, kind: 'Integration',
    keywords: 'solidworks integration add-in addin api 2022 dassault native features task pane' },

  // Project Management
  { id: 'page:work', title: 'BIZOMAT Project Management', summary: WORK.summary, url: '/work/', area: W, kind: 'Product',
    keywords: 'project management projects task management tasks teams collaboration work management boards planning tracking progress monday asana trello workflow' },
  { id: 'page:work-views', title: 'Project Management views: Table, Kanban, Calendar, Gantt and more', summary: 'Nine views on one shared data model: Table, Kanban, Calendar, Timeline and Gantt with dependencies and milestones, Chart, Workload, Form, Map and Files.', url: '/work/#views', area: W, kind: 'Capability',
    keywords: 'table kanban board boards calendar timeline gantt chart workload form map files view views schedule dependencies milestones' },
  { id: 'page:work-teams', title: 'Teams, roles and permissions', summary: 'Workspaces with owner, admin, member and viewer roles, teams, invitations, private boards, board roles and an audit log.', url: '/work/#teams', area: W, kind: 'Capability',
    keywords: 'teams team management roles permissions access invitations invite members admin owner viewer audit log work allocation assign' },
  { id: 'page:work-collaboration', title: 'Collaboration: updates, mentions, files and documents', summary: 'Updates and replies with @mentions, attachments, activity history, notifications, rich-text documents with version history and comments.', url: '/work/#collaboration', area: W, kind: 'Capability',
    keywords: 'collaboration comments updates mentions attachments files documents notifications activity history sharing' },
  { id: 'page:work-automations', title: 'Project Management automations', summary: 'Trigger, conditions, actions: let status changes, dates and schedules move work forward, with run logs, retries and loop prevention.', url: '/work/#automations', area: W, kind: 'Capability',
    keywords: 'automation automations automate workflow workflows trigger triggers conditions actions recurring reminders due dates business process automation routine' },
  { id: 'page:work-dashboards', title: 'Dashboards, goals and planning', summary: 'Eleven live dashboard widget types, goals, My Work, My Day and a weekly planner.', url: '/work/#dashboards', area: W, kind: 'Capability',
    keywords: 'dashboard dashboards reporting reports widgets charts goals okr my work planner progress tracking kpi' },
  { id: 'int:work', title: 'Integrations: Slack, Microsoft Teams and webhooks', summary: WORK.integrations, url: '/work/#integrations', area: W, kind: 'Integration',
    keywords: 'integration integrations slack microsoft teams webhook webhooks api token google sign-in connect systems' },

  // Customer Relationship Management (CRM)
  { id: 'page:crm', title: 'BIZOMAT Customer Relationship Management (CRM)', summary: CRM.summary, url: '/crm-platform/', area: M, kind: 'Product',
    keywords: 'crm customer relationship management customers clients contacts companies accounts leads prospects deals opportunities sales pipeline sales team selling follow ups hubspot pipedrive salesforce' },
  { id: 'page:crm-pipeline', title: 'CRM pipelines and deals: a board you drag deals across', summary: 'Several pipelines with your own stages and probabilities, a drag-and-drop board with Won and Lost, products and services on each deal, weighted value and stage history.', url: '/crm-platform/#pipeline', area: M, kind: 'Capability',
    keywords: 'pipeline pipelines deals deal board kanban stages probability weighted forecast won lost opportunity sales process products quote' },
  { id: 'page:crm-leads', title: 'CRM leads: capture, score and convert', summary: 'Lead statuses from New to Converted, a lead score that explains itself, duplicate warnings, and conversion into a contact, a company and a deal in one step.', url: '/crm-platform/#records', area: M, kind: 'Capability',
    keywords: 'leads lead management lead scoring qualify qualification convert conversion prospects enquiries contacts companies duplicates' },
  { id: 'page:crm-activities', title: 'CRM activities, follow-ups and calendar', summary: 'Calls, emails, meetings, visits and tasks with due dates, priorities and outcomes; overdue follow-ups, a calendar and a subscription for your own calendar app.', url: '/crm-platform/#activities', area: M, kind: 'Capability',
    keywords: 'activities follow ups follow-up reminders calls meetings appointments tasks calendar ics schedule visits overdue' },
  { id: 'page:crm-reports', title: 'CRM dashboard and sales reports', summary: 'A dashboard and eleven reports computed from your records: pipeline, revenue, forecast, win and loss, lead sources, salesperson performance, deal ageing and sales cycle.', url: '/crm-platform/#reports', area: M, kind: 'Capability',
    keywords: 'sales reports reporting dashboard forecast revenue win rate conversion funnel salesperson performance kpi analytics csv export' },
  { id: 'page:crm-automations', title: 'CRM automations', summary: 'Seven ready-made automations and your own: a trigger, conditions and actions that notify people, create follow-ups, set priorities, flag deals or assign owners.', url: '/crm-platform/#automations', area: M, kind: 'Capability',
    keywords: 'crm automation automations workflow triggers reminders notify follow up assign owner sales automation' },
  { id: 'page:crm-roles', title: 'CRM organisations, roles and permissions', summary: 'Several organisations per account, six roles from Owner to Viewer, permissions per module and action, invitations, teams and an audit trail.', url: '/crm-platform/#roles', area: M, kind: 'Capability',
    keywords: 'organisations roles permissions team members invite invitations owner administrator manager sales executive viewer access audit trail multi company' },
  { id: 'doc:crm-guide', title: 'How to use BIZOMAT Customer Relationship Management: the user guide', summary: 'Step by step: create an organisation, invite your team, add customers, work leads and deals, plan follow-ups, read reports and set up automations.', url: '/crm-platform/guide/', area: M, kind: 'Documentation',
    keywords: 'crm guide user guide how to help getting started tutorial manual instructions set up import contacts csv invite team' },
  { id: 'int:crm', title: 'CRM integrations: email logging, calendar, CSV and Project Management', summary: CRM.integrations, url: '/crm-platform/#integrations', area: M, kind: 'Integration',
    keywords: 'crm integrations email gmail outlook microsoft 365 calendar ics csv import export project management tasks' },

  // Resources
  { id: 'page:resources', title: 'BIZOMAT Resources', summary: RESOURCES.summary, url: '/resources/', area: R, kind: 'Page',
    keywords: 'resources calculators tools books guides library learning free reference' },
  { id: 'page:tools', title: 'Tools: engineering, manufacturing and business calculators', summary: 'Calculators that show their method and run in your browser, grouped by topic, with an input guide for every field.', url: '/tools/', area: R, kind: 'Page',
    keywords: 'tools calculators calculator calculate compute engineering dimensions units conversion design checks manufacturing business costing' },
  { id: 'page:library', title: 'Library: technical books in short chapters', summary: 'Engineering, manufacturing, operations, projects, technology and business books, read chapter by chapter.', url: '/reados/', area: R, kind: 'Page',
    keywords: 'library books chapters reading engineering manufacturing operations projects business technology knowledge' },
  { id: 'page:guides', title: 'Guides and articles', summary: 'Longer guides with worked examples.', url: '/library/', area: R, kind: 'Page',
    keywords: 'guides guide articles how to worked examples tutorials business automation' },
  { id: 'page:pathways', title: 'Learning paths', summary: 'Structured paths through the Library and the Tools for a subject, from first principles to applied practice.', url: '/resources/#pathways', area: R, kind: 'Page',
    keywords: 'learning paths course courses learn study training education curriculum' },

  // Platform
  { id: 'page:engine-room', title: 'The Engine Room: proof that BIZOMAT works', summary: 'What BIZOMAT has built and how it works: architecture, real screens, test results, the engineering record and how the applications connect.', url: '/engine-room/', area: P, kind: 'Page',
    keywords: 'engine room proof of work evidence demonstration screenshots architecture technical proof how it works tests results test record system diagram engineering record' },
  { id: 'page:founder', title: 'The Engine Room: from the founder', summary: 'Why BIZOMAT exists, from its founder, and the principles it runs on.', url: '/engine-room/#founder', area: P, kind: 'Page',
    keywords: 'about company founder mission team story who principles background' },
  { id: 'page:privacy', title: 'Privacy policy', summary: 'What BIZOMAT collects, why, where it is kept and your rights.', url: '/privacy/', area: P, kind: 'Page',
    keywords: 'privacy policy personal data data protection retention deletion cookies' },
  { id: 'page:terms', title: 'Terms of use', summary: 'The terms for using the BIZOMAT website and applications.', url: '/terms/', area: P, kind: 'Page',
    keywords: 'terms of use terms and conditions agreement acceptable use liability' },
  { id: 'page:disclaimer', title: 'Disclaimer', summary: 'Limits of AI output, calculations and CAD automation, and your responsibility to verify engineering work.', url: '/disclaimer/', area: P, kind: 'Page',
    keywords: 'disclaimer liability ai output verification engineering responsibility' },
];
