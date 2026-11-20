import type { Guide } from '../types.ts';

const guide: Guide = {
  id: 'trouble-access',
  section: 'troubleshooting',
  title: 'Access and permission problems',
  status: 'live',
  what: 'What to do when a module is missing, a button is not there, an action is refused or a record answers "not found". BIZOMAT checks every action on the server against your company, your role in each tool and your ERP roles, and its messages say which check stopped you.',
  purpose: [
    'Find out why a module, record or button is missing.',
    'Understand messages such as "Only engineering approvers and ERP administrators can approve documents".',
    'Know who in your company can give you access.',
    'Tell a permission problem from a module switched off by BIZOMAT.',
  ],
  who: [
    'Anyone refused an action or missing a module.',
    'Company owners and administrators who give roles.',
    'ERP administrators.',
  ],
  access: {
    path: ['BIZOMAT ERP', 'Administration', 'ERP roles'],
    href: 'https://bizomat.ai/erp/administration',
    label: 'Open Administration',
    note: 'ERP roles are given by the company owner and administrators (ERP administrators). Roles in Sales and CRM, Finance and Project Management are set in each tool, also reached from Administration.',
  },
  tutorials: [
    {
      id: 'why-missing',
      title: 'Find out why a module or record is missing',
      outcome: 'You know which check stopped you and who can change it.',
      steps: [
        {
          title: 'Check the company you are working in',
          body: 'The company name is at the top of the side menu. BIZOMAT ERP opens in the company you used last on this computer. Open the company menu to switch: Your companies, then Shared with you for tools other companies share with you.',
          where: 'Your companies',
        },
        {
          title: 'Read the message',
          body: 'A message such as "Maintenance is switched off for this company. Ask BIZOMAT support if you need it." means BIZOMAT switched that module off for your company. A message such as "Only buyers, procurement managers and ERP administrators can change suppliers" means your role does not include the action.',
        },
        {
          title: 'Check whether you are in the company',
          body: 'A message such as "You do not have access to products and engineering in" a company means you only share a tool with it. The ERP modules are for people in the company; people who only share a tool with it do not see them.',
        },
        {
          title: 'Check your ERP roles',
          body: 'Product Management shows "Your ERP roles" under its title, and Administration, ERP roles lists yours under Your roles. Owners and administrators are ERP administrators; other members are viewers until an ERP administrator gives them roles.',
          where: 'Your roles',
        },
        {
          title: "Check your role in the tool",
          body: 'Sales and CRM, Finance and Project Management each give you a role of their own (for example Sales Executive in the CRM, or view access to a board). Their administrators change it in the tool: Team in Sales and CRM and in Finance, and Board members on a board in Project Management.',
        },
        {
          title: 'Read "not found" carefully',
          body: 'A record of another company, or one you may not see, answers as not found, so its existence is never revealed. Switch to the right company first. If it still says not found, it may have been deleted, or you need access to it.',
        },
      ],
      after: 'Ask the person who can give the access: the company owner or an administrator for ERP roles, the tool\'s administrator for a tool role, and BIZOMAT support for a module that is switched off.',
    },
    {
      id: 'give-erp-roles',
      title: 'Give someone ERP roles',
      outcome: 'The person can do the work their roles allow in the ERP modules.',
      needs: 'Company owner or administrator (an ERP administrator).',
      steps: [
        { title: 'Open ERP roles', body: 'In BIZOMAT ERP, open Administration and choose ERP roles.', where: 'ERP roles' },
        { title: 'Find the person', body: 'Under People, find the person. The Roles column shows what they hold now.', where: 'People' },
        {
          title: 'Tick their roles',
          body: 'Tick the roles they need, for example Engineer, Buyer, Warehouse operator or Quality inspector. The list under The roles says what each one may do. A person can hold several.',
        },
        { title: 'Save', body: 'Choose Save. The server checks every action against these roles from now on.', where: 'Save' },
      ],
      after: 'Remember segregation of duties: nobody approves what they drafted, created, raised, submitted or counted, so give approving roles to at least two people.',
    },
  ],
  faqs: [
    {
      q: 'A module is missing, or says it is switched off for this company.',
      a: '"<Module> is switched off for this company. Ask BIZOMAT support if you need it." BIZOMAT can switch a module off for a company, and then its pages and API answer this to everyone in that company. Only BIZOMAT can switch it back on: contact BIZOMAT support.',
    },
    {
      q: 'It says I do not have access to a module in a company.',
      a: 'For example "You do not have access to products and engineering in" the company. People in the company have access to the ERP modules; people who only share a tool with it (shown under Shared with you) do not. Ask the company owner or an administrator to add you to the company (see /learn/companies/).',
    },
    {
      q: 'It says only certain roles can do something.',
      a: 'Messages such as "Only engineering approvers and ERP administrators can approve documents" or "Viewers and executives cannot raise purchase requisitions" name the roles that may do it. Ask an ERP administrator (the company owner or an administrator) to give you that role in Administration, ERP roles (see /learn/roles-and-permissions/).',
    },
    {
      q: 'I am in the company but can only read the ERP modules.',
      a: 'Members other than the owner and administrators are viewers until an ERP administrator gives them roles. Viewers read products, engineering records, suppliers, purchasing, stock and manufacturing, but change nothing.',
    },
    {
      q: 'Why can I not approve something I created?',
      a: 'Segregation of duties: "You drafted this change order, so another engineering approver must approve and release it." Nobody approves a change order they drafted, a supplier they created, a requisition they raised, a purchase order or quotation choice they made, an adjustment they asked for, a count they counted or a routing they drafted, or a corrective action they proposed or carry out. Ask another approver. In a company of one person the rule allows an exception, and the exception is recorded.',
    },
    {
      q: 'A link says "not found", but the record existed.',
      a: 'Check that you are working in the right company: a record of another company answers as not found. Then check that you may see it, and that it was not deleted or archived. A Company not found answer sends you back to the ERP\'s start page.',
    },
    {
      q: 'BIZOMAT ERP opened the wrong company.',
      a: 'It opens the company you used last on this computer. Switch with the company menu at the top of the side menu. Project Management, Sales and CRM, Finance and My Work then open that company\'s own tools.',
    },
    {
      q: 'In Sales and CRM I can see a record but not change it.',
      a: 'A Sales Executive or Member changes only the records they own; a Viewer only reads. The record\'s owner, a Manager or an Administrator can change it, or reassign it to you (see /learn/crm/).',
    },
    {
      q: 'Project Management says "You need edit access to this board".',
      a: 'You have view access to that board. Ask the board owner or a workspace administrator to give you edit access under Board members in the board header (see /learn/projects/).',
    },
    {
      q: 'Finance says my role cannot do something.',
      a: 'Messages such as "Your Finance role cannot create invoices" come from your role in Finance. A Finance administrator changes it in Finance, under Team, Roles and permissions (see /learn/finance/).',
    },
    {
      q: 'I cannot make someone an administrator, or change my own role.',
      a: '"Only the owner can make someone an administrator", and "Nobody can change their own role or access. Ask the owner or another administrator." Only the company owner makes administrators, and nobody changes their own role (see /learn/company-administration/).',
    },
    {
      q: 'I cannot see health records in Health and Safety.',
      a: 'Only people with the Health officer role read medical details. It is an ERP role given in Administration, WHS roles (see /learn/whs/).',
    },
    {
      q: 'I cannot see other people\'s CAD computers.',
      a: 'In a registered company, the owner and administrators see everyone\'s CAD computers; other members see their own; people who only share a tool see none, and other companies never see them. The example company has no CAD computers.',
    },
    {
      q: 'I cannot invite anyone to the example company.',
      a: 'The example company, Acme Studio (example), is invented data for you alone: only you see it and nobody can be invited to it. Use your own or a registered company for real work.',
    },
    {
      q: 'What is the ERP console at /erp/admin?',
      a: 'It is for BIZOMAT\'s own platform administrators only. Company owners and administrators manage their company in Administration.',
    },
    {
      q: 'It says the company is not verified yet, so its tools are closed.',
      a: 'This applies only where BIZOMAT has switched verification enforcement on, which it has not for now. If you see it, the owner and administrators can see what is needed in Company settings, Verification.',
    },
  ],
  related: ['roles-and-permissions', 'companies', 'company-administration', 'navigation', 'trouble-sign-in'],
  notYet: [
    { text: 'Member access by module, with all, team or own scope and sensitive fields, set on one Members page for every module: built, but switched off for now.', status: 'in-development' },
    { text: 'The Company Admin console for company owners and administrators: built, but switched off for now.', status: 'in-development' },
  ],
  keywords: ['permission denied', 'access denied', 'forbidden', '403', 'not found', '404', 'missing module', 'role', 'ERP roles', 'viewer', 'read only', 'segregation of duties', 'cannot approve', 'switched off', 'wrong company'],
  sources: [
    'apps/work/src/worker/erp/access.ts',
    'apps/work/src/worker/erp/changes.ts',
    'apps/work/src/worker/platform/module-gate.ts',
    'apps/work/src/worker/platform/flags.ts',
    'apps/work/src/worker/company/members-gate.ts',
    'apps/work/src/worker/services/permissions.ts',
    'apps/work/src/worker/crm/access.ts',
    'apps/work/src/shared/crm/roles.ts',
    'apps/work/src/client/system/SystemApp.tsx',
    'apps/work/src/client/system/erp/Roles.tsx',
    'apps/work/src/client/system/erp/Products.tsx',
    'apps/work/src/client/components/layout/SuiteRail.tsx',
    'apps/work/src/client/lib/company-context.ts',
    'docs/platform/company-context.md',
    'docs/platform/roles.md',
    'docs/platform/members.md',
  ],
  updated: '2026-11-20',
};

export default guide;
