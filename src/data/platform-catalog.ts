// The BIZOMAT platform catalogue: public facts about the two applications and the website's own sections.
//
// One source for the product pages (/cad-automation/, /work/), the homepage cards, the Engine Room (/engine-room/) and the AI search index
// (/discovery-index.json "pages"). Every entry is PUBLIC: product descriptions, documentation and page addresses.
// Nothing here comes from, or points into, a customer's projects, files or account, so search over it cannot reveal
// private data. Every capability is taken from the applications' own code and documentation in this repository:
//   CAD Automation:      apps/cad/opensketch/site.py (claims checked against sw_tools.py, the feature registry,
//                        auth.py, mcpauth.py, devicebridge.py), apps/cad/opensketch/catalog.py, apps/cad/docs/
//   Project Management:  apps/work/README.md (feature table), apps/work/ARCHITECTURE.md, apps/work/src/shared/columns.ts
// Keep it that way: when a capability changes in an app, change it here in the same commit.
import { APP_LINKS } from '../config/platform.ts';

export type PlatformArea = 'CAD Automation' | 'Project Management' | 'Resources' | 'BIZOMAT';
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

// ---------- Resources (formerly kevos.com Tools and Library) ----------
export const RESOURCES = {
  name: 'Resources',
  headline: 'Calculators, tools, books and guides. Free, without an account.',
  summary:
    'Engineering, manufacturing, operations and business calculators that show their method, a technical library of books in short chapters, longer guides and learning paths.',
} as const;

const C = 'CAD Automation';
const W = 'Project Management';
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
