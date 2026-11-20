import type { Guide } from '../types.ts';

// What BIZOMAT ERP is, how its modules link, and the words it uses. Facts: the module rail
// (apps/work/src/client/components/layout/SuiteRail.tsx), the ERP's own pages (apps/work/src/client/system/SystemApp.tsx),
// the links between tools (apps/work/src/client/crm/CompanyLinks.tsx), the systems catalogue (src/config/systems.ts) and
// the capability registry (src/data/erp-capabilities.ts) for what is planned.
const guide: Guide = {
  id: 'what-is-bizomat',
  section: 'getting-started',
  title: 'What is BIZOMAT ERP?',
  short: 'What is BIZOMAT',
  status: 'live',
  what: 'BIZOMAT ERP is one workspace at bizomat.ai/erp where a business runs its sales, money, projects, products, purchasing, stock, production, quality, shipping, maintenance and health and safety. Everything in it belongs to a company, and every module opens inside the same screen with one BIZOMAT account.',
  purpose: [
    'Keep the customers, deals, invoices, projects and operations of a company in one place.',
    'Move work from one module to the next without typing it again, for example a won deal to a draft invoice in Finance.',
    'Give each person a role, so they see and change only what their work needs.',
    'Learn safely in your own example company, Acme Studio, before using your own data.',
    'Read the reports of every module of a company from one Reports page.',
  ],
  who: [
    'Owners of small and medium businesses',
    'Office, sales and finance staff',
    'Project and operations managers',
    'Engineers, buyers, warehouse and production staff',
    'Maintenance and health and safety teams',
    'Anyone new to ERP software who wants the terms explained',
  ],
  access: {
    path: ['BIZOMAT ERP', 'Dashboard'],
    href: 'https://bizomat.ai/erp/',
    label: 'Open BIZOMAT ERP',
    note: 'If you are signed out, the address shows the sign-in page first.',
  },
  tutorials: [
    {
      id: 'first-look',
      title: 'Take a first look around',
      outcome: 'You know where the modules are and which company you are working in.',
      steps: [
        { title: 'Open BIZOMAT ERP', body: 'Go to bizomat.ai/erp and sign in with your BIZOMAT account. The Dashboard of the company you used last opens. The first time, that is your own company.', where: 'Sign in' },
        { title: 'Read the module rail', body: 'The dark bar on the left lists the modules: Dashboard, Project Management, Sales and CRM, Finance and Accounting, Product Management, Engineering, Procurement, Warehouse, Maintenance, Health and Safety, Reports and Administration. Report a fault sits at its foot.', where: 'Dashboard' },
        { title: 'Check the company', body: 'The company switcher in the top bar shows the name of the company you are working in. Everything you open in the rail belongs to that company.' },
        { title: 'Open the example company', body: 'Open the company switcher and choose Acme Studio (example), under Example company. It holds invented data in every module, and only you can see it. The first time you open the ERP it takes a moment to prepare.', where: 'Example company' },
        { title: 'Open a module', body: 'Choose Sales and CRM in the rail. The CRM of the example company opens inside the ERP, with the rail still on the left.', where: 'Sales and CRM' },
        { title: 'Go back to the Dashboard', body: 'Choose Dashboard in the rail. Each card is one module of this company, with its progress figures where your role shows them.', where: 'Dashboard' },
      ],
      after: 'Next, learn the menus (/learn/navigation/) or set up your own business (/learn/companies/).',
    },
    {
      id: 'see-the-links',
      title: 'See how the modules link',
      outcome: 'You have seen where a deal in the CRM connects to Finance and to Project Management.',
      steps: [
        { title: 'Work in the example company', body: 'Choose Acme Studio (example) in the company switcher, so nothing you try touches your own data.' },
        { title: 'Open a deal', body: 'Choose Sales and CRM in the rail, then Deals in the CRM’s side menu, and open a deal.', where: 'Deals' },
        { title: 'Find the links to the other tools', body: 'On the deal you see what it can become in the company’s other tools: Start a quote makes a draft quote in Finance, Start a project makes a board in Project Management, and once the deal is won, Make a draft invoice makes a draft invoice in Finance.', where: 'Start a quote' },
        { title: 'Open Finance and Accounting', body: 'Choose Finance and Accounting in the rail. The same company’s Finance workspace opens. A draft made from a deal waits there for someone whose Finance role may check and approve it.', where: 'Finance and Accounting' },
        { title: 'Open Engineering', body: 'Choose Engineering in the rail. Its overview shows Design, CAD Automation, Manufacturing and Quality, each with what waits in it and a button to open it; its side menu lists their sections.', where: 'Engineering' },
      ],
      after: 'Each chain of modules, for example from a deal to an invoice, has its own walk-through (/learn/workflows/).',
    },
    {
      id: 'read-what-waits',
      title: 'See what is waiting in a company',
      outcome: 'You know where to find the approvals and jobs waiting in a company.',
      steps: [
        { title: 'Choose the company', body: 'In the company switcher, choose the company you want to look at.' },
        { title: 'Read the Dashboard', body: 'Choose Dashboard in the rail. Each module’s card counts what waits: requisitions and purchase orders to approve, purchase orders to receive, products to reorder, orders in production and late, nonconformances, orders to allocate, shipments to pick, pack or dispatch, open and overdue work orders and safety figures.', where: 'Dashboard' },
        { title: 'Open a count', body: 'Choose a tile. It opens the list behind the number, already filtered.' },
        { title: 'Check your own work', body: 'Choose Project Management in the rail, then My Work in its side menu, to see the tasks assigned to you and any health and safety actions for you.', where: 'Project Management' },
      ],
    },
  ],
  buttons: [
    { label: 'Module rail', does: 'Opens a module of the company you are working in.', when: 'To move between Sales and CRM, Finance and Accounting, Project Management and the other modules.', after: 'The module opens inside the ERP; the rail stays on the left.' },
    { label: 'Company switcher', does: 'Shows the company you are working in and lets you choose another, or register a new one.', when: 'When you belong to more than one company, or want to open the example company.', after: 'The Dashboard of the chosen company opens.' },
    { label: 'Dashboard', does: 'One card per module with its progress for the company: Project Management, Sales and CRM, Finance and Accounting, Product Management, Engineering, Procurement, Warehouse, Maintenance and Health and Safety.', when: 'To see what waits in the company and open a module.' },
    { label: 'Reports', does: 'Lists every report of the company’s modules in one place.', when: 'To read figures across the company.', after: 'Each report opens in its own module, with that module’s permissions.' },
    { label: 'Administration', does: 'Links to the company’s people, departments, tools, ERP roles and settings, and to your own profile and security.', when: 'To set up a company or change who may do what.' },
    { label: 'Report a fault', does: 'Raises a maintenance request from any screen of the ERP.', when: 'When something is broken or needs maintenance.', after: 'The request goes to the company’s maintenance team, or waits for approval where the company asks for it.' },
  ],
  faqs: [
    { q: 'What do company, own company and example company mean?', a: 'A company is the business you work in: everything in the ERP belongs to one. A registered company has its details, people, departments and roles. Your own company is in your own name, is not registered, and holds the tools you own outside a registered company. The example company, Acme Studio (example), is invented data for you to learn with; only you can see it (/learn/companies/).' },
    { q: 'What do module, tool, workspace and organisation mean?', a: 'A module is an entry in the rail, such as Maintenance or Reports. A tool is one of the three applications a company runs, each with its own members and roles: a Project Management workspace, a Sales and CRM organisation and a Finance workspace. "Workspace" and "organisation" are those tools’ own words for their space.' },
    { q: 'What are departments and roles?', a: 'A department is a team in the company, such as Sales or a site. It is made once and appears as a team in Project Management and the CRM and as a department in Finance. A role says what a person may do: a company role, a role in each tool, and job roles in the ERP modules, Maintenance and Health and Safety (/learn/roles-and-permissions/).' },
    { q: 'What is the difference between BIZOMAT ERP and the Systems on the website?', a: 'The Systems pages at bizomat.ai/systems/ describe the software: BIZOMAT ERP, CRM, Finance, Projects, Engineering Automation, Manufacturing and Operations, and WHS. You use them all inside BIZOMAT ERP with one account. CAD Automation, the application of Engineering Automation, opens in BIZOMAT ERP’s Engineering module.' },
    { q: 'Do I have to pay?', a: 'No. The ERP’s Billing page says BIZOMAT is free for every company, and registering a company says nothing is charged.' },
    { q: 'Does Finance connect to my bank or lodge my BAS?', a: 'No. Finance never connects to a bank, takes no payments and does not lodge with the ATO. You import statements you download from your bank, and Finance prepares a GST and BAS worksheet for you or your agent (/learn/finance/).' },
    { q: 'Are stock and production values posted to the Finance ledger?', a: 'No. Stock, production and maintenance values are kept in the ERP modules, and each posting is recorded as planned. Nothing is posted to Finance’s ledger from them today.' },
    { q: 'Does BIZOMAT tell me whether an incident must be reported to a regulator?', a: 'No. BIZOMAT never decides whether an incident is reportable and does not submit anything to a regulator. The Health and Safety module keeps the record of the decision a person made and of what they submitted. Its legal packs are marked Not verified until checked against the official source (/learn/whs/).' },
    { q: 'Can I use it on a phone?', a: 'Yes, in the phone’s browser. The module rail becomes a bar along the bottom of the screen, and some modules have screens made for phones, such as the warehouse screen and the shop floor (/learn/navigation/).' },
  ],
  related: ['account-and-sign-in', 'navigation', 'companies', 'roles-and-permissions', 'dashboard', 'reports'],
  workflows: ['lead-to-customer', 'deal-to-invoice', 'deal-to-project', 'procure-to-pay', 'make-to-order', 'maintenance-request-to-work-order'],
  notYet: [
    { text: 'Superannuation payments, statutory tax tables and reporting to tax authorities: the ERP’s pay runs use the rates you set.', status: 'planned' },
    { text: 'Customer service cases, service contracts, warranty and field service.', status: 'planned' },
    { text: 'Posting stock, production and maintenance value to Finance’s ledger.', status: 'planned' },
    { text: 'Subsidiaries and several legal entities under one company.', status: 'planned' },
    { text: 'An AI assistant that works on ERP records.', status: 'planned' },
  ],
  keywords: ['ERP', 'enterprise resource planning', 'business management system', 'overview', 'introduction', 'glossary', 'terms', 'what is', 'modules', 'BIZOMAT System', 'getting started', 'free'],
  sources: [
    'src/config/systems.ts',
    'src/data/erp-capabilities.ts',
    'apps/work/src/client/components/layout/SuiteRail.tsx',
    'apps/work/src/client/system/SystemApp.tsx',
    'apps/work/src/client/crm/CompanyLinks.tsx',
    'apps/work/src/client/crm/CrmApp.tsx',
    'apps/work/src/client/system/billing/Billing.tsx',
    'apps/work/src/client/company/Register.tsx',
    'apps/work/src/worker/system/example.ts',
    'docs/system/README.md',
  ],
  updated: '2026-11-20',
};

export default guide;
