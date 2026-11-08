// The BIZOMAT platform catalogue: public facts about the two applications.
//
// One source for the product pages (/cad-automation/, /work/), the homepage cards and the Engine Room (/engine-room/).
// Every entry is PUBLIC: product descriptions and documentation. Nothing here comes from, or points into, a customer's
// projects, files or account. Every capability is taken from the applications' own code and documentation in this repository:
//   CAD Automation:      apps/cad/opensketch/site.py (claims checked against sw_tools.py, the feature registry,
//                        auth.py, mcpauth.py, devicebridge.py), apps/cad/opensketch/catalog.py, apps/cad/docs/
//   Project Management:  apps/work/README.md (feature table), apps/work/ARCHITECTURE.md, apps/work/src/shared/columns.ts
// Keep it that way: when a capability changes in an app, change it here in the same commit.

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
