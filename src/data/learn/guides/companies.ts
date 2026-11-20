import type { Guide } from '../types.ts';

// Companies: registered, own and example. Facts: the company switcher, the Company page and the example company
// (apps/work/src/client/system/SystemApp.tsx: CompanySwitcher, CompanySettings, ExampleCard, ExampleBanner), the
// registration form (apps/work/src/client/company/Register.tsx), the company area (apps/work/src/client/company/Pages.tsx
// and lib.ts: checks, departments, settings), the example company (apps/work/src/worker/system/example.ts) and the flags
// international_registration, join_requests, registry_verification_enabled and scheduled_reverification (all off).
const guide: Guide = {
  id: 'companies',
  section: 'getting-started',
  title: 'Companies',
  short: 'Companies',
  status: 'live',
  what: 'Everything in BIZOMAT ERP belongs to a company. You always have your own company, in your own name; you can register your business as a company, belong to several companies, and learn in an example company of invented data.',
  purpose: [
    'Register your business, or yourself as a sole trader, as a company.',
    'Switch between the companies you work in.',
    'Keep the tools you own outside a registered company in your own company.',
    'Learn with the example company, Acme Studio (example), then remove it.',
    'Set up departments that appear in every tool.',
  ],
  who: ['Business owners registering their company', 'Sole traders working in their own name', 'People who work for more than one company', 'Administrators setting up departments'],
  access: {
    path: ['BIZOMAT ERP', 'Administration', 'Company overview'],
    href: 'https://bizomat.ai/erp/company/',
    label: 'Open your companies',
    note: 'The company switcher at the top of every ERP page also lists your companies and has Register a company.',
  },
  tutorials: [
    {
      id: 'register',
      title: 'Register a company',
      outcome: 'Your business is a registered company with its own Projects and Tasks, Sales and CRM and Finance tools.',
      steps: [
        { title: 'Choose Register a company', body: 'Open the company switcher in the top bar and choose Register a company at the bottom. The Register your company page opens.', where: 'Register a company' },
        { title: 'Say who the account is for', body: 'Choose A business (a company, partnership, trust or sole trader, registered with its ABN) or Myself, in my own name (an ABN is optional).', where: 'A business' },
        { title: 'Enter the details', body: 'Fill in the Business name, ABN (11 digits), and for a company the ACN and Legal name. Then the Contact email, Phone, Street address, Address line 2 if needed, Suburb or town, State or territory, Postcode and Website.', where: 'ABN (Australian Business Number)' },
        { title: 'Read the checks as you type', body: 'The ABN’s check digits are checked. Where the Australian Business Register lookup is set up, the register’s name, entity type and GST status show under the form. The phone is checked against the Australian numbering plan, and the postcode against the state. Things to check lists anything that looks wrong.', where: 'Things to check' },
        { title: 'Choose the tools', body: 'Under Tools, for Project Management, Customer Relationship Management and Finance choose Create new, Use (a tool you already own), or Not now. Only business Finance workspaces can belong to a company; personal and household ones stay private.', where: 'Tools' },
        { title: 'Choose Register company', body: 'The company’s overview opens. If the contact email is not your own confirmed sign-in address, a confirmation link is sent to it.', where: 'Register company' },
        { title: 'Read the company checks', body: 'Under Company checks, each line says what was checked: the ABN (Format checked when only the check digits were checked), whether the contact email was confirmed by its link, and the phone and postcode checks.', where: 'Company checks' },
      ],
      after: 'Invite your people and give them roles (/learn/company-administration/).',
    },
    {
      id: 'switch',
      title: 'Switch between companies',
      outcome: 'You are working in the company you chose, and the rail opens its tools.',
      steps: [
        { title: 'Open the company switcher', body: 'Choose the company’s name in the top bar.', where: 'Your companies' },
        { title: 'Read the list', body: 'Your companies come first, with your role or "Own" beside each. Shared with you lists companies where someone added you to a tool, with the number of tools. Example company lists Acme Studio (example).', where: 'Shared with you' },
        { title: 'Choose a company', body: 'Its Dashboard opens. Records of the company you left are cleared from the screen, so nothing of it shows in the new one.', where: 'Dashboard' },
        { title: 'Open its tools', body: 'Sales and CRM, Finance and Accounting, Projects and Tasks and My Work in the rail now open this company’s own tools.' },
      ],
    },
    {
      id: 'own-company',
      title: 'Use and rename your own company',
      outcome: 'Your own company has the name you want.',
      steps: [
        { title: 'Choose your own company', body: 'In the company switcher, choose the company marked Own. Its Dashboard says "Your own company (not registered)".' },
        { title: 'Open Company', body: 'In the side menu, choose Company.', where: 'Company' },
        { title: 'Change the name', body: 'Type the new name under Company name and choose Save. Your own company has no ABN and no people of its own.', where: 'Company name' },
        { title: 'Register when you are ready', body: 'Register a company on the same page starts a registered company, which can have people, departments and roles.', where: 'Register a company' },
      ],
    },
    {
      id: 'example-company',
      title: 'Learn with the example company',
      outcome: 'You have tried BIZOMAT on invented data and removed it when you were done.',
      steps: [
        { title: 'Open Acme Studio (example)', body: 'It is made the first time you open BIZOMAT ERP. In the company switcher, choose it under Example company.', where: 'Example company' },
        { title: 'Read the banner', body: 'A banner says it is invented data to learn BIZOMAT: only you can see it, nothing you change affects your own companies, and it sends no email.' },
        { title: 'Try anything', body: 'Open any module from the rail and add, change or delete records. Nobody can be invited into the example company.' },
        { title: 'Remove it', body: 'Choose Administration in the rail. Under Example company, choose Remove the example company and confirm with Remove.', where: 'Remove the example company' },
        { title: 'Add it again later', body: 'Administration then offers Add the example company again, which makes a fresh one.', where: 'Add the example company again' },
      ],
    },
    {
      id: 'departments',
      title: 'Set up departments',
      outcome: 'The company’s departments exist once and appear in every tool.',
      needs: 'The company’s owner or an administrator. A department’s head can change who is in it.',
      steps: [
        { title: 'Open Departments', body: 'Choose Administration in the rail, then Departments.', where: 'Departments' },
        { title: 'Choose New department', body: 'Give it a Name, and under Part of choose the department it sits in, or The company (top level). Add a Description if you like.', where: 'New department' },
        { title: 'Choose the head and people', body: 'Pick the Head and tick the People in it. The head sees this department’s figures in every tool.', where: 'Head' },
        { title: 'Save', body: 'Choose Save. You see "Department made in every tool": it is a team in Projects and Tasks and the CRM and a department in Finance’s tracking.', where: 'Save' },
        { title: 'Archive what you no longer use', body: 'Archive takes a department out of use; tick Show archived departments and choose Restore to bring it back.', where: 'Archive' },
      ],
    },
  ],
  buttons: [
    { label: 'Register a company', does: 'Opens the registration form.', when: 'To work as a business with people, departments and roles.', after: 'The new company appears in the company switcher.' },
    { label: 'Register company', does: 'Saves the registration and makes or links the tools you chose.', when: 'At the end of the registration form.', after: 'The company overview opens; a confirmation link may go to the contact email.' },
    { label: 'Send the confirmation link again', does: 'Sends a new link to the company’s contact email.', when: 'The contact email shows "not confirmed yet".' },
    { label: 'Look up the ABN again', does: 'Looks the ABN up on the Australian Business Register.', when: 'In Company settings, after the business’s details changed. Without the register lookup set up, only the check digits are checked.' },
    { label: 'Save', does: 'Renames your own company.', when: 'On the Company page of your own company.' },
    { label: 'New department', does: 'Makes a department in the company and in every tool.', when: 'To mirror the business’s teams, sites or functions.' },
    { label: 'Archive', does: 'Takes a department out of use; Restore brings it back.', when: 'A team is closed or merged.' },
    { label: 'Remove the example company', does: 'Deletes Acme Studio (example) and its records.', when: 'You no longer need it.', after: 'Add the example company again makes a new one.' },
  ],
  faqs: [
    { q: 'Do I need to register a company to use BIZOMAT ERP?', a: 'No. Everyone has their own company in their own name, ready the first time they sign in. Register a company when you want to add people, departments and roles.' },
    { q: 'What do the ABN checks prove?', a: 'Always that the ABN’s check digits are valid: the badge then says Format checked. Only where the Australian Business Register lookup is set up is the ABN also looked up there, and then the company shows what the register says. The phone number is checked against the Australian numbering plan but never called or texted, and the postcode against the state. The Verification card in Company settings shows the status only the register or a BIZOMAT review can set.' },
    { q: 'Can I register a company outside Australia?', a: 'Not yet. Company registration is for Australian businesses today. Registration in other countries is built and switched off.' },
    { q: 'My business is already registered by someone else. How do I join it?', a: 'Ask its owner or an administrator to invite you (/learn/company-administration/). Asking to join from the registration form is built and not switched on yet.' },
    { q: 'What does "Shared with you" mean?', a: 'Someone in that company added you to one of its tools directly, not to the company. You see only those tools, and the company’s settings and modules are not shown to you.' },
    { q: 'Is the example company shared with anyone?', a: 'No. Only you see it, nobody can be invited into it, it sends no email, and its tools cannot join a registered company.' },
    { q: 'Can I belong to several companies?', a: 'Yes. Register more than one, accept invitations from others, and switch between them with the company switcher.' },
    { q: 'How do I close a company?', a: 'The owner opens Company settings and chooses Close company account, typing the company’s name to confirm. The tools keep their people and records; only the company account goes.' },
    { q: 'Why is my company marked suspended?', a: 'A suspended company’s ERP modules answer "This company account is suspended. Contact BIZOMAT support." Its tools stay as they are. Contact BIZOMAT through bizomat.ai/contact/.' },
  ],
  related: ['what-is-bizomat', 'navigation', 'roles-and-permissions', 'company-administration', 'dashboard'],
  notYet: [
    { text: 'Registering a company in countries other than Australia, with each country’s own registration numbers.', status: 'in-development' },
    { text: 'Asking to join a company that is already registered, instead of registering it twice.', status: 'in-development' },
    { text: 'Automatic checks of a company against its country’s official register, repeated on a schedule.', status: 'in-development' },
    { text: 'Subsidiaries and several legal entities under one company.', status: 'planned' },
  ],
  keywords: ['company', 'business', 'organisation', 'register', 'registration', 'ABN', 'ACN', 'sole trader', 'switch company', 'multiple companies', 'example company', 'Acme Studio', 'demo', 'sandbox', 'department', 'team', 'own company'],
  sources: [
    'apps/work/src/client/system/SystemApp.tsx',
    'apps/work/src/client/company/Register.tsx',
    'apps/work/src/client/company/CompanyApp.tsx',
    'apps/work/src/client/company/Pages.tsx',
    'apps/work/src/client/company/lib.ts',
    'apps/work/src/worker/system/example.ts',
    'apps/work/src/worker/system/system.ts',
    'apps/work/src/worker/erp/access.ts',
    'apps/work/src/worker/platform/flags.ts',
    'docs/platform/verification.md',
    'docs/company/README.md',
  ],
  updated: '2026-11-20',
};

export default guide;
