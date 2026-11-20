// Homepage picks. Every id must exist: tool ids in the BIZOMAT register (public/tools/data-*.js) and book ids as the
// Library names them (publication-<book>, collection-<book> or guide-<slug>). The build stops if one is missing.
// Counts on the homepage are never written here; they are read from the catalogues at build time.

/** BIZOMAT tools shown under "Featured tools", one from each of several topics. */
export const HOME_FEATURED_TOOLS = [
  'bolt-torque-preload',
  'bearing-l10-life',
  'cutting-speed',
  'hydraulic-cylinder',
  'process-capability',
  'investment-appraisal',
];

/** Library books shown under "Featured books", one from each of several subjects. */
export const HOME_FEATURED_BOOKS = [
  'publication-bolted-joints-by-the-numbers',
  'publication-sheet-metal-parts-by-the-numbers',
  'publication-shop-floor-optimisation-by-the-numbers',
  'publication-front-end-planning-by-the-numbers',
  'publication-engineering-tools-people-use',
  'collection-investment-appraisal-and-business-cases',
];

/**
 * Example searches under the homepage AI Search box. The short label is what the visitor sees; the question is what it
 * puts in the box (they can edit it before asking). Each one leads to real BIZOMAT pages, tools or Library chapters:
 * the search recommends what exists; it does not open files or carry out the task.
 */
export const HOME_DISCOVERY_EXAMPLES = [
  { label: 'Engineering calculators', question: 'Find a tool to calculate engineering dimensions.' },
  { label: 'Automate SOLIDWORKS', question: 'How can I automate SolidWorks?' },
  { label: 'Project management', question: 'Show me project management capabilities.' },
  { label: 'Business automation guides', question: 'Find guides about business automation.' },
] as const;

/** Example requests for the learning-path box in the Tools and Library page headers (LearningPlanner.astro). */
export const PLANNER_EXAMPLES = {
  tools: [
    'Teach me how to calculate manufacturing costs.',
    'Help me understand bolted joint design and the calculations behind it.',
    'I want to learn how to size motors and variable-speed drives.',
  ],
  library: [
    'Teach me mechanical engineering from beginner to advanced.',
    'I want to learn engineering project management.',
    'Help me understand lean manufacturing and continuous improvement.',
  ],
} as const;

/**
 * The BIZOMAT ERP ecosystem on the homepage (owner's brief of 20 Nov 2026): the module rail's groups as BIZOMAT ERP shows
 * them (apps/work/src/client/components/layout/SuiteRail.tsx: each label and its line are the rail's own), each with the
 * Knowledge Centre guides of its modules (ids in src/data/learn/; the build stops if one is missing). Every status comes
 * from the guide, so nothing planned is shown as working.
 */
export const HOME_ERP_GROUPS = [
  { rail: 'Dashboard', line: 'Your company, its tools and their figures.', guides: ['dashboard'] },
  { rail: 'Sales and CRM', line: 'Customers, leads, deals and follow-ups.', guides: ['crm'] },
  { rail: 'Finance and Accounting', line: 'Quotes, invoices, bills, banking, GST and reports.', guides: ['finance'] },
  { rail: 'Projects and Tasks', line: 'Boards, timelines, documents and dashboards.', guides: ['projects'] },
  { rail: 'Products and Engineering', line: 'Products, bills of materials, revisions, engineering changes, documents and CAD Automation.', guides: ['products', 'cad-automation'] },
  { rail: 'Operations', line: 'Procurement, inventory, manufacturing, quality and supply chain.', guides: ['procurement', 'inventory', 'manufacturing', 'quality', 'supply-chain'] },
  { rail: 'Maintenance', line: 'Asset Management and Maintenance: assets, requests, work orders and preventive maintenance.', guides: ['maintenance'] },
  { rail: 'Health and Safety', line: 'Hazards, risk assessments, incidents, investigations and actions.', guides: ['whs'] },
  { rail: 'Reports', line: 'Every report of your tools in one place.', guides: ['reports'] },
  { rail: 'Administration', line: 'Company, people, departments, tools, ERP roles and permissions.', guides: ['company-administration', 'companies', 'roles-and-permissions'] },
] as const;

/** Where to start learning, by who you are (each opens a Knowledge Centre guide or a free resource). */
export const HOME_LEARN_STARTS = [
  { who: 'New to BIZOMAT', what: 'What BIZOMAT ERP is, and your first steps.', href: '/learn/what-is-bizomat/' },
  { who: 'Business owners', what: 'Set up your company, its people and departments.', href: '/learn/companies/' },
  { who: 'Administrators', what: 'Members, roles, security and settings.', href: '/learn/company-administration/' },
  { who: 'Engineers', what: 'An AI assistant working in SOLIDWORKS on your computer.', href: '/learn/cad-automation/' },
  { who: 'Manufacturing and operations', what: 'From a bill of materials to finished goods.', href: '/learn/workflows/bom-to-production/' },
  { who: 'Developers', what: 'API tokens, the AI connector and how the tools link.', href: '/learn/integrations/' },
  { who: 'Students', what: 'Free engineering tools and the Library, no account needed.', href: '/resources/' },
] as const;
