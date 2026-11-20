import type { Guide } from '../types.ts';

// The ERP Dashboard and My Work. Facts: the Dashboard is the company's home page (apps/work/src/client/system/SystemApp.tsx:
// SystemHome, CompanyHome, ToolCard, WhsCard), its figures come from each tool with that tool's permissions
// (apps/work/src/worker/system/system.ts, apps/work/src/worker/company/summary.ts); My Work is the Projects and Tasks page
// of the company's workspace (SystemApp.tsx MyWorkRedirect, apps/work/src/client/pages/MyWork.tsx, MyDay.tsx).
const guide: Guide = {
  id: 'dashboard',
  section: 'modules',
  title: 'Dashboard and My Work',
  short: 'Dashboard',
  status: 'live',
  what: 'The Dashboard is the home page of a company in BIZOMAT ERP: one card per module, with the figures your roles may see. My Work lists everything assigned to you in Projects and Tasks, by due date, with your health and safety actions.',
  purpose: [
    'See a company’s open tasks, deals, money and operations at a glance.',
    'Open any module of the company from its card.',
    'Find the tasks assigned to you, overdue first.',
    'Plan your day by adding tasks to My Day.',
    'See health and safety actions, hazards and investigations waiting for you.',
  ],
  who: ['Owners and managers checking how the business is going', 'Everyone starting their working day', 'People who work in several companies'],
  access: {
    path: ['BIZOMAT ERP', 'Dashboard'],
    href: 'https://bizomat.ai/erp/',
    label: 'Open the Dashboard',
    note: 'My Work has its own entry in the rail, at bizomat.ai/erp/my-work.',
  },
  tutorials: [
    {
      id: 'read-the-dashboard',
      title: 'Read a company’s Dashboard',
      outcome: 'You know what each card shows and how to open the module behind it.',
      steps: [
        { title: 'Open the Dashboard', body: 'Choose Dashboard in the rail. The page title is the company’s name; under it you see what kind of company it is and, for a registered company, your role.', where: 'Dashboard' },
        { title: 'Read the tool cards', body: 'Projects and Tasks shows Open tasks, Overdue, Due in 7 days and Projects. Sales and CRM shows Open deals, Pipeline, Won in 30 days and Follow-ups due. Finance and Accounting shows Income, Expenses, Owed to you and You owe, for this financial year so far from posted entries.', where: 'Open tasks' },
        { title: 'Open a tool', body: 'Choose Open on a tool card. The card also says the tool’s name and Your role in it.', where: 'Open' },
        { title: 'Read the Health and Safety card', body: 'People whose WHS role lets them see the registers see Active hazards, High risks, Open incidents and Overdue actions. Everyone else sees Your open reports and Actions for you.', where: 'Health and Safety' },
        { title: 'Open an operations module', body: 'The cards Maintenance, Products and Engineering, Procurement, Inventory, Manufacturing, Quality and Supply Chain each open their module for this company.', where: 'Procurement' },
        { title: 'See how many people', body: 'The line at the foot says how many people are in the company. People, departments and tool roles are managed in Administration.' },
      ],
      after: 'For more detail, open Reports in the rail (/learn/reports/).',
    },
    {
      id: 'my-work',
      title: 'Work through My Work',
      outcome: 'You have seen everything assigned to you and opened what is due first.',
      steps: [
        { title: 'Open My Work', body: 'Choose My Work in the rail. It opens My Work in the Projects and Tasks workspace of the company you are working in.', where: 'My Work' },
        { title: 'Read the groups', body: 'Your tasks are grouped as Overdue, Today, Next 7 days, Later, No due date and Completed, with a count on each. Choose a group’s name to fold or unfold it.', where: 'Overdue' },
        { title: 'Open a task', body: 'Choose a task’s name to open it, or the board’s name beside it to open the whole board.' },
        { title: 'Check tasks shared with you', body: 'Shared with me lists single tasks someone shared with you, without the rest of their project.', where: 'Shared with me' },
        { title: 'Check health and safety work', body: 'Health and safety lists your WHS actions (overdue first), hazards you are responsible for, investigations you are on, notification records to complete, risk assessments waiting for your approval and unread alerts, in every company. Each opens in the Health and Safety module.', where: 'Health and safety' },
      ],
    },
    {
      id: 'plan-my-day',
      title: 'Plan your day',
      outcome: 'The tasks you will do today are in My Day.',
      steps: [
        { title: 'Open My Work', body: 'Choose My Work in the rail.', where: 'My Work' },
        { title: 'Add a task to My Day', body: 'On a task that is not done, choose My Day. You see "Added to your plan".', where: 'My Day' },
        { title: 'Open My Day', body: 'In the Projects and Tasks menu, choose My Day to see today’s plan.', where: 'My Day' },
      ],
    },
    {
      id: 'add-a-tool',
      title: 'Add a missing tool to a registered company',
      outcome: 'The company runs the tool and the Dashboard shows its card.',
      needs: 'The company’s owner.',
      steps: [
        { title: 'Open Tools', body: 'Choose Administration in the rail, then Tools. Each tool the company does not run says Not part of the company yet.', where: 'Tools' },
        { title: 'Choose a new or existing tool', body: 'In the tool’s list, choose Create a new one, or Use followed by the name of a tool you already own.', where: 'Create a new one' },
        { title: 'Add it', body: 'Choose Add to the company. You see the tool’s name and "added".', where: 'Add to the company' },
        { title: 'Go back to the Dashboard', body: 'Choose Dashboard in the rail. The tool’s card is there, with your role in it.', where: 'Dashboard' },
      ],
      after: 'Give people a role in the new tool under People and roles (/learn/company-administration/).',
    },
  ],
  buttons: [
    { label: 'Open', does: 'Opens the tool shown on a card.', when: 'To work in that company’s Projects and Tasks, Sales and CRM or Finance.' },
    { label: 'Module cards', does: 'Maintenance, Health and Safety, Products and Engineering, Procurement, Inventory, Manufacturing, Quality and Supply Chain each open their module for this company.', when: 'To go straight to a module from the Dashboard.' },
    { label: 'Company switcher', does: 'Changes the company the Dashboard shows.', when: 'You work in more than one company.' },
    { label: 'My Work', does: 'Lists the tasks assigned to you, grouped by due date.', when: 'At the start of the day, or to find what is overdue.' },
    { label: 'My Day', does: 'Adds a task to today’s plan.', when: 'To pick what you will do today.', after: '"Added to your plan"; the task shows in My Day.' },
    { label: 'Group headings', does: 'Fold or unfold Overdue, Today, Next 7 days, Later, No due date and Completed.', when: 'To focus on what is due.' },
  ],
  faqs: [
    { q: 'Why do I see a note instead of a tool’s figures?', a: 'Figures are shown only to people whose role in that tool shows them, and the card says so. Ask the company’s owner or an administrator if your work needs them (/learn/roles-and-permissions/).' },
    { q: 'Which company does the Dashboard show?', a: 'The company you last opened on this computer, else your first company. Choose another in the company switcher.' },
    { q: 'Why is a task missing from My Work?', a: 'My Work lists tasks where you are in a person column, in the boards you can open, in the Projects and Tasks workspace of the company you are working in. Switch company to see another company’s tasks, and check the task has you as its owner or assignee.' },
    { q: 'Do Finance figures include drafts?', a: 'No. Income, Expenses, Owed to you and You owe come from posted entries, for this financial year so far.' },
    { q: 'Why are quality or maintenance tasks not in My Work?', a: 'My Work lists Projects and Tasks work and health and safety work. Maintenance work orders are under My work on the Maintenance overview, and overdue corrective actions show on the Quality overview.' },
    { q: 'Can I change what the Dashboard shows?', a: 'Not yet: the cards are the same for everyone, filled with what each person may see. In Projects and Tasks you can build your own dashboards from board data (/learn/projects/).' },
    { q: 'Why does the Dashboard say "Shared with you"?', a: 'Someone in that company added you to some of its tools, not to the company itself. The Dashboard shows just those tools; the company’s other modules are not shown to you.' },
  ],
  related: ['navigation', 'reports', 'projects', 'crm', 'finance', 'whs', 'maintenance'],
  workflows: ['project-to-completion', 'maintenance-request-to-work-order', 'incident-to-action'],
  notYet: [
    { text: 'Dashboards per role, with measures across modules such as on-time delivery.', status: 'planned' },
  ],
  keywords: ['home', 'home page', 'overview', 'KPI', 'figures', 'summary', 'my tasks', 'to do', 'assigned to me', 'my day', 'today', 'overdue', 'workload'],
  sources: [
    'apps/work/src/client/system/SystemApp.tsx',
    'apps/work/src/client/pages/MyWork.tsx',
    'apps/work/src/client/pages/MyDay.tsx',
    'apps/work/src/client/components/layout/AppShell.tsx',
    'apps/work/src/client/components/layout/SuiteRail.tsx',
    'apps/work/src/client/lib/company-context.ts',
    'apps/work/src/worker/system/system.ts',
    'apps/work/src/client/system/maintenance/Maintenance.tsx',
    'src/data/erp-capabilities.ts',
    'docs/system/README.md',
  ],
  updated: '2026-11-20',
};

export default guide;
