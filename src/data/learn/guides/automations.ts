import type { Guide } from '../types.ts';

const guide: Guide = {
  id: 'automations',
  section: 'ai',
  title: 'Automations',
  status: 'live',
  what: 'Automations are rules that BIZOMAT runs by itself on the server: when something happens (the trigger) and the conditions hold, it carries out the actions. Projects and Tasks has automations on each board, and Sales and CRM has automations for leads, contacts, deals and activities.',
  purpose: [
    'Set a date, assign someone or move a task when its status changes.',
    'Remind people before or after a due date.',
    'Create a recurring task every day, week or month.',
    'Notify people, create follow-up activities and flag deals in the CRM.',
    'Send board events to a webhook, Slack or Microsoft Teams.',
  ],
  who: [
    'Project managers and board owners.',
    'Team leads who want reminders and hand-offs to happen by themselves.',
    'Sales managers and CRM administrators.',
    'Workspace administrators who set up integrations for webhooks.',
  ],
  access: {
    path: ['BIZOMAT ERP', 'Projects and Tasks', 'Automations'],
    href: 'https://bizomat.ai/erp/tasks/',
    label: 'Open Projects and Tasks',
    note: 'Each board also has Automate in its header. CRM automations are under Sales and CRM, Automations (https://bizomat.ai/erp/crm/).',
  },
  tutorials: [
    {
      id: 'board-automation',
      title: 'Add an automation to a board',
      outcome: 'The board has a rule that runs on the server each time its trigger fires.',
      needs: 'Edit or admin access to the board. People with view access can see automations and their logs, but not change them.',
      steps: [
        { title: 'Open the board', body: 'In Projects and Tasks, open the board (project) the rule is for.' },
        { title: 'Open Automate', body: 'Choose Automate in the board header. The Automations window lists the rules on this board.', where: 'Automate' },
        {
          title: 'Start from a recipe or from scratch',
          body: 'Choose Recipes to see ready-made rules, such as "When status changes to Done, set a date to today", then Use. A recipe the board cannot use says what it needs, for example a date column. Or choose Add automation to start from scratch.',
          where: 'Add automation',
        },
        {
          title: 'Choose the trigger',
          body: 'Next to When, choose what starts the rule: an item is created, a status changes, a column value changes, an item moves to a group, an update is posted, a date arrives, or on a recurring schedule. Then choose the column, status, group or timing it asks for.',
          where: 'When',
        },
        {
          title: 'Add conditions, if you need them',
          body: 'Next to If, choose Add condition to run the rule only for some items, for example only when the item is not done. With no condition, it runs always. Conditions are checked against the item as it is when the rule runs.',
          where: 'Add condition',
        },
        {
          title: 'Choose the actions',
          body: 'Next to Then, choose what happens: set a column value, set a date to today, clear a column, assign someone, move the item to a group, send a notification, create an item, create a subitem, duplicate the item, archive the item or send a webhook. Choose Add another action for more, up to ten.',
          where: 'Add another action',
        },
        {
          title: 'Name it and save',
          body: 'Type a name, or leave it empty and a description is made for you. Read the sentence at the bottom of the window, which says what the rule will do, then choose Save automation.',
          where: 'Save automation',
        },
      ],
      after: 'Each run is logged. Choose Log next to the automation to see when it ran, its status, the item, the attempts and any error.',
    },
    {
      id: 'recurring-task',
      title: 'Create a task every week by itself',
      outcome: 'A new task appears in the chosen group of the board every week.',
      needs: 'Edit or admin access to the board.',
      steps: [
        { title: 'Open Automate on the board', body: 'Open the board, choose Automate, then Recipes.', where: 'Recipes' },
        { title: 'Use the weekly recipe', body: 'Next to "Every Monday, create a recurring task", choose Use. Or choose Add automation and, next to When, choose on a recurring schedule.', where: 'Use' },
        {
          title: 'Set the schedule',
          body: 'Choose every day, every week or every month, the weekday or the day of the month, and the hour. The hour is in UTC (for example, 08:00 UTC is in the evening in eastern Australia), so pick it with your time zone in mind.',
          where: 'Hour (UTC)',
        },
        {
          title: 'Set what it creates',
          body: 'Next to Then, keep create an item, choose the group and type the name. Use {date} in the name to add the date, for example "Weekly check-in {date}".',
        },
        { title: 'Save', body: 'Choose Save automation. Schedules are checked every 15 minutes, so the task appears within a quarter of an hour of the time you chose.', where: 'Save automation' },
      ],
      after: 'Scheduled rules run without an item, so they can only create items, send notifications or send webhooks. They do not run on an archived board.',
    },
    {
      id: 'crm-automation',
      title: 'Set up an automation in Sales and CRM',
      outcome: 'The CRM notifies people, creates follow-ups or flags deals by itself when something changes.',
      needs: 'The Owner, Administrator or Manager role in the CRM. A Sales Executive can see automations but not change them; Members and Viewers do not see them.',
      steps: [
        { title: 'Open Automations', body: 'In BIZOMAT ERP, open Sales and CRM and choose Automations in its menu.', where: 'Automations' },
        {
          title: 'Start from a template or from scratch',
          body: 'Under Templates, choose one, such as Remind about overdue follow-ups or Flag deals close to their expected close date. Or choose New automation.',
          where: 'New automation',
        },
        {
          title: 'Choose the trigger',
          body: "Under When, choose the event: a lead is created, assigned or changes status; a contact is created; a deal is created, enters a stage, is won or lost, or its expected close date is near; an activity or task is assigned to someone; or an activity or follow-up becomes overdue.",
          where: 'When',
        },
        {
          title: 'Add conditions, if you need them',
          body: 'Under Only if (optional), choose Add a condition, for example Value at least a certain amount, or a particular Owner or Priority.',
          where: 'Add a condition',
        },
        {
          title: 'Add the actions',
          body: 'Choose Add an action: Send a notification, Create a follow-up activity, Set the priority, Flag the deal or Assign an owner. The actions offered depend on the trigger. A notification message can use placeholders, for example {record} moved to {stage} ({value}).',
          where: 'Add an action',
        },
        { title: 'Save and switch it on', body: 'Choose Save. The switch next to each automation turns it on or off.', where: 'Save' },
      ],
      after: 'The Execution history tab lists every run. Scheduled triggers (overdue activities, deals near their close date) are checked every 15 minutes, and each record fires once.',
    },
  ],
  buttons: [
    { label: 'Automate', does: "Opens the board's automations in Projects and Tasks.", when: 'You want to see, add or change the rules of one board.' },
    { label: 'Recipes', does: 'Shows ready-made rules for the board, each with Use.', when: 'You want a common rule without building it yourself.', after: 'The rule opens in the builder for you to check and save.' },
    { label: 'Add automation', does: 'Opens an empty rule in the builder (When, If, Then).', after: 'Nothing runs until you choose Save automation.' },
    { label: 'Save automation', does: 'Saves the rule and switches it on.', after: 'It runs on the server the next time its trigger fires.' },
    { label: 'Log', does: 'Shows the run log: when each run happened, its status (succeeded, failed, skipped or running), the item, the attempts and the details.', when: 'An automation did not do what you expected.' },
    { label: 'On/off switch', does: 'Pauses or enables an automation without deleting it.', after: 'A paused automation shows Paused and does not run.' },
    { label: 'Delete', does: 'Deletes the automation after you confirm.', after: 'Its run history is deleted too.' },
    { label: 'Manage on board', does: 'From the Automations page of Projects and Tasks, opens the board where an automation lives.', when: 'You want to edit an automation you found in the full list.' },
    { label: 'New automation', does: 'Opens the CRM automation builder (When, Only if, actions).', when: 'You are an Owner, Administrator or Manager in the CRM.' },
    { label: 'Execution history', does: 'Lists each run of the CRM automations.', when: 'You want to check that a CRM automation ran.' },
  ],
  faqs: [
    {
      q: 'Why can I not add or change automations?',
      a: 'On a board you need edit or admin access; with view access you see the automations and their logs only. In the CRM, Owners, Administrators and Managers manage automations; a Sales Executive can only see them, and Members and Viewers see "Your role does not include automations". Ask the board owner, a workspace administrator or a CRM administrator (see /learn/roles-and-permissions/).',
    },
    {
      q: 'My automation did not run. What do I check?',
      a: 'Check that it is not Paused. Check that the conditions are true for the item now, because they are checked when the rule runs. For dates and schedules, remember the hour is in UTC and schedules are checked every 15 minutes. Then open Log: a run can show failed with the error, or skipped, for example "Loop prevented". A failed run is tried again, up to three attempts, and the log shows "Retry scheduled".',
    },
    {
      q: 'Can one automation start another?',
      a: 'Yes, within limits. In Projects and Tasks, changes made by an automation can trigger other rules up to three levels deep, and the same rule never runs twice for the same item in one chain. In the CRM, an automation can cause one more level of triggers, never more.',
    },
    {
      q: 'Can the same event run an automation twice?',
      a: 'No. Every run is recorded with a key for its event, so the same event never runs the same automation twice, even when a schedule is checked again.',
    },
    {
      q: 'Does "send a notification" send an email?',
      a: "It always creates a notification in the app. Each person decides in their notification settings whether automation notifications also come by email, and email is sent only where the service's email is set up (see /learn/notifications/).",
    },
    {
      q: 'What does "send a webhook" need?',
      a: 'An integration on the workspace: an outgoing webhook, Slack or Microsoft Teams, added by a workspace administrator under Integrations. Without one, the builder says "No integrations yet — an admin can add one under Integrations." (see /learn/integrations/).',
    },
    {
      q: 'Where can I see every automation at once?',
      a: 'In Projects and Tasks, choose Automations in the menu. It lists the automations across your boards, how many are active, their runs and logs, with Manage on board to edit one. In the CRM, Automations lists them all.',
    },
    {
      q: 'Why does my new CRM already have automations?',
      a: 'Every new CRM organisation starts with six template automations switched on, such as Tell the owner about a new lead and Remind about overdue follow-ups. Each can be edited, switched off or deleted.',
    },
    {
      q: 'Can an automation in one tool change another tool, for example a won deal creating a project?',
      a: 'Not as an automation. Links between tools are buttons you choose, such as Start a project or Make a draft invoice on a deal (see /learn/integrations/). Automations that span systems are planned.',
    },
  ],
  related: ['projects', 'crm', 'integrations', 'notifications', 'roles-and-permissions'],
  workflows: ['project-to-completion', 'lead-to-customer'],
  notYet: [
    { text: 'Automations that span systems, for example a CRM event changing a project or a Finance record.', status: 'planned' },
  ],
  keywords: ['workflow automation', 'rules', 'triggers', 'actions', 'recipes', 'recurring task', 'reminder', 'notification', 'webhook', 'if this then that', 'scheduled task', 'CRM automation'],
  sources: [
    'apps/work/src/client/components/automations/AutomationBuilder.tsx',
    'apps/work/src/client/pages/Automations.tsx',
    'apps/work/src/client/board/BoardPage.tsx',
    'apps/work/src/client/components/layout/AppShell.tsx',
    'apps/work/src/worker/services/automations.ts',
    'apps/work/src/worker/routes/automations.ts',
    'apps/work/src/worker/services/notify.ts',
    'apps/work/src/worker/crm/automations.ts',
    'apps/work/src/worker/crm/routes-automations.ts',
    'apps/work/src/shared/crm/automations.ts',
    'apps/work/src/shared/crm/roles.ts',
    'apps/work/src/client/crm/Automations.tsx',
    'apps/work/src/client/crm/CrmApp.tsx',
    'src/data/erp-capabilities.ts',
  ],
  updated: '2026-11-20',
};

export default guide;
