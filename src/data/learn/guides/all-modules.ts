import type { Guide } from '../types.ts';

// All modules, the approval inbox and the modules framework's common screens. Facts: the 97-module catalogue is
// apps/work/src/shared/erp-catalogue.ts (served by apps/work/src/worker/erp/objects/routes.ts, GET /catalogue); the page is
// apps/work/src/client/system/erp/objects/ModulesHome.tsx (ModulesHome, InboxPage); each module's screens are
// apps/work/src/client/system/erp/objects/ModuleArea.tsx; lists, steps, actions, files, comments, imports, saved filters,
// alerts and the search are in apps/work/src/worker/erp/objects/ (routes.ts, store.ts, alerts.ts); module definitions in
// apps/work/src/shared/erp-objects/; custom fields in apps/work/src/worker/erp/objects/custom.ts and
// apps/work/src/client/system/erp/objects/CustomFields.tsx. Tested in apps/work/test/erp-modules.test.ts and
// apps/work/test/erp-custom-fields.test.ts.
const guide: Guide = {
  id: 'all-modules',
  section: 'modules',
  title: 'All modules',
  short: 'All modules',
  status: 'live',
  what: 'All modules lists the 97 modules of BIZOMAT ERP with where each stands (Live, Live extended, New, Partly built or Planned), what it does today and what it does not do yet, and opens the ones your roles include. It also searches records across the modules and shows what is waiting for you.',
  purpose: [
    'See every module of the ERP, by area, and open the one you need.',
    'Search employees, contracts, tickets, vehicles, assets and other records, and the ERP’s products, suppliers and orders, in one place.',
    'See approvals waiting for you and the records that are yours or given to you.',
    'Keep your favourite modules at hand, on this computer.',
    'Work in the newer modules the same way: lists with filters, records with their steps, files, comments and history, reports, CSV export and import.',
  ],
  who: ['Everyone in a company', 'Managers who approve requests', 'ERP administrators setting up the modules and workflow rules'],
  access: {
    path: ['BIZOMAT ERP', 'All modules'],
    href: 'https://bizomat.ai/erp/modules',
    label: 'Open All modules',
    note: 'What is waiting for you is at bizomat.ai/erp/inbox; each module opens at bizomat.ai/erp/m/ followed by its name.',
  },
  tutorials: [
    {
      id: 'find-a-module',
      title: 'Find and open a module',
      outcome: 'The module you need is open, and kept as a favourite if you want it.',
      steps: [
        { title: 'Open All modules', body: 'Choose All modules in the rail. The figures at the top count the modules that are Live, New, Partly built and Planned.', where: 'All modules' },
        { title: 'Narrow the list', body: 'Type in Find a module, or choose an Area or a Status. Each module shows its number, what it does today and, under Not yet, what it does not do.', where: 'Find a module' },
        { title: 'Open it', body: 'Choose Open. When Open is missing, the module is planned, switched off for the company, or your ERP roles do not include it (it says which).', where: 'Open' },
        { title: 'Keep it as a favourite', body: 'Choose the star on its card, or Add to favourites at the top of the module. Favourites are kept on this computer and listed in the side menu.', where: 'Add to favourites' },
      ],
    },
    {
      id: 'work-a-record',
      title: 'Add a record and move it through its steps',
      outcome: 'A record is saved, numbered, and taken through its workflow, with its history kept.',
      steps: [
        { title: 'Open the list', body: 'In a module, choose the tab of the kind of record, for example Leave requests or Contracts.', where: 'Overview' },
        { title: 'Add one', body: 'Choose New, fill in the fields (the required ones say so) and any lines, then choose Add. It gets its number, such as CT-00001.', where: 'New' },
        { title: 'Take a step', body: 'The buttons at the top of the record are the steps you may take now, such as Ask for approval or Approve. A step that needs a reason asks for it.', where: 'Ask for approval' },
        { title: 'Add files and comments', body: 'Use the Files and Comments tabs. Everyone who may read the record sees them.', where: 'Files' },
        { title: 'Read the history', body: 'The History tab lists every change with who made it and when. Pay details are named as changed, never shown.', where: 'History' },
      ],
      after: 'Someone else approves what you made or asked for: the same person never approves their own record, unless they are alone in the company, and then the exception is recorded.',
    },
    {
      id: 'import-and-export',
      title: 'Import and export records',
      outcome: 'Records came in from a CSV file, or went out to one.',
      needs: 'Importing needs a role that may add these records.',
      steps: [
        { title: 'Export', body: 'On a list, set the filters you want, then choose Export CSV. The file has the fields your roles may read.', where: 'Export CSV' },
        { title: 'Prepare a file to import', body: 'Choose Import. Use a header row with the field names shown, up to 500 records; give references (people, customers, records) by their name or number, and money in dollars.', where: 'Import' },
        { title: 'Check before importing', body: 'Choose Check. Every row is checked; nothing is saved while one is wrong, and the rows at fault are listed.', where: 'Check' },
        { title: 'Import', body: 'Choose Import. The records are added with their numbers and history.', where: 'Import' },
      ],
    },
    {
      id: 'custom-fields',
      title: 'Add a field of your own',
      outcome: 'A kind of record has a field your company needs, checked like the others.',
      needs: 'An ERP administrator.',
      steps: [
        { title: 'Open the list', body: 'In a module, open the tab of the kind of record, for example Contracts.', where: 'Contracts' },
        { title: 'Open Custom fields', body: 'Choose Custom fields at the top of the list.', where: 'Custom fields' },
        { title: 'Describe the field', body: 'Give its Name and Kind (text, long text, number, money, date, a choice or yes or no). For a choice, type the choices separated by commas. Tick Required or Show in the list if you want.', where: 'Name' },
        { title: 'Add it', body: 'Choose Add the field. It shows in a Custom fields section of the form and the record, in the CSV export, and in imports by its name.', where: 'Add the field' },
      ],
      after: 'Archive a field to hide it; what was entered is kept, and Restore brings it back.',
    },
    {
      id: 'workflow-rules',
      title: 'Tell people when a record reaches a status',
      outcome: 'A workflow rule tells a role at once, and escalates when a record waits too long.',
      needs: 'An ERP administrator.',
      steps: [
        { title: 'Open Workflow rules', body: 'In All modules, open Workflow and business process automation, then Workflow rules.', where: 'Workflow rules' },
        { title: 'Choose the records and status', body: 'Choose New workflow rule, pick the Records (for example People and HR: Leave requests) and type the Status (for example submitted).', where: 'Records' },
        { title: 'Choose whom to tell', body: 'Choose Tell this role or Tell this person. For an escalation, give Escalate after (days) and Escalate to.', where: 'Tell this role' },
        { title: 'Save it', body: 'Choose Add. From then on the alert reaches them in the app, and by email where email is set up.', where: 'Add' },
      ],
    },
  ],
  buttons: [
    { label: 'Open', does: 'Opens a module of the catalogue.', when: 'When the module is built and your roles include it.' },
    { label: 'Search everything', does: 'Finds records across the modules, and the ERP’s products, suppliers and orders, that your roles let you see.', when: 'When you know a name or number but not where it is. Press / to start typing.' },
    { label: 'Waiting for me', does: 'Lists approvals waiting for you and the open records that are yours or given to you.', when: 'At the start of the day.' },
    { label: 'Save filter', does: 'Keeps the list’s current filters under a name, for you only.', when: 'For a list you open often in the same way.' },
    { label: 'Archive', does: 'Takes a record out of the lists while keeping it and its history; Restore brings it back.', after: 'Only a record still in its first status that nothing refers to can be deleted outright.' },
  ],
  faqs: [
    { q: 'Why can I not open a module?', a: 'Your ERP roles do not include it, it is switched off for the company, or it is planned. An ERP administrator gives roles on the ERP roles page (/learn/#roles-and-permissions).' },
    { q: 'Why do I only see my own records?', a: 'Some modules show everything only to the roles that manage them, for example People and HR. Everyone else sees the records that are theirs, given to them, or waiting for their approval.' },
    { q: 'Why is a field hidden?', a: 'Pay details and some other fields are shown only to the roles that need them, and to the person themselves. The record says that some fields are hidden.' },
    { q: 'Why can I not approve something I made?', a: 'Segregation of duties: someone else approves it. In a company of one person the exception is allowed and recorded on the record.' },
    { q: 'Are favourites kept on my account?', a: 'No. Favourites and recently used modules are kept on this computer only, like the theme.' },
    { q: 'Can we add our own fields?', a: 'Yes. An ERP administrator chooses Custom fields on a list. Each field is your company’s own; nobody else sees it.' },
    { q: 'What does Partly built mean?', a: 'Part of the module works today and the card says, under Not yet, what does not. Planned modules are not built.' },
  ],
  related: ['roles-and-permissions', 'notifications', 'reports', 'people-hr'],
  notYet: [
    { text: 'A drag-and-drop workflow designer: workflow rules notify and escalate, they do not change records.', status: 'planned' },
    { text: 'Custom fields on the earlier ERP screens (products, orders, stock); the newer modules and the CRM have them.', status: 'planned' },
  ],
  keywords: ['module list', 'catalogue', 'app launcher', 'menu', 'global search', 'universal search', 'inbox', 'approvals', 'tasks waiting', 'favourites', 'bookmarks', 'workflow', 'escalation', 'CSV import', 'bulk import', 'export'],
  sources: ['apps/work/src/shared/erp-catalogue.ts', 'apps/work/src/client/system/erp/objects/ModulesHome.tsx', 'apps/work/src/client/system/erp/objects/ModuleArea.tsx', 'apps/work/src/worker/erp/objects/routes.ts', 'apps/work/src/worker/erp/objects/custom.ts', 'apps/work/test/erp-modules.test.ts', 'apps/work/test/erp-custom-fields.test.ts'],
  updated: '2026-11-20',
};

export default guide;
