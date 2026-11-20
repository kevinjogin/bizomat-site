import type { Guide } from '../types.ts';

// Who can do what. Facts: company roles and their tool presets (apps/work/src/client/company/lib.ts, Pages.tsx People;
// apps/work/src/worker/company/routes.ts member rules; docs/platform/roles.md), ERP roles and segregation of duties
// (apps/work/src/worker/erp/access.ts, apps/work/src/client/system/erp/Roles.tsx), Maintenance roles
// (apps/work/src/worker/maintenance/access.ts, apps/work/src/client/system/maintenance/Maintenance.tsx), CRM permissions
// (apps/work/src/shared/crm/roles.ts, apps/work/src/client/crm/Settings.tsx). The Members page with module access,
// scopes and sensitive fields is behind the flag company_members_v2 (off; docs/platform/members.md).
const guide: Guide = {
  id: 'roles-and-permissions',
  section: 'getting-started',
  title: 'Roles and permissions',
  short: 'Roles',
  status: 'live',
  what: 'Each person has a role in the company, a role in each of its tools, and job roles in the ERP modules, Maintenance and Health and Safety. The server checks every action against these roles, and nobody approves what they drafted or submitted themselves.',
  purpose: [
    'Understand the five company roles and what each sets in the tools.',
    'See the roles you hold in a company.',
    'Give people roles in Project Management, Sales and CRM and Finance.',
    'Give ERP, Health and Safety and Maintenance job roles.',
    'Understand segregation of duties: why someone else must approve.',
  ],
  who: ['Company owners and administrators', 'Managers who need to know why someone cannot act', 'Anyone who sees "You do not have permission"'],
  access: {
    path: ['BIZOMAT ERP', 'Administration', 'ERP roles'],
    href: 'https://bizomat.ai/erp/administration',
    label: 'Open Administration',
    note: 'People and roles (company and tool roles) and ERP roles are both on the Administration page.',
  },
  tutorials: [
    {
      id: 'see-your-roles',
      title: 'See the roles you hold',
      outcome: 'You know your company role, your tool roles and your ERP and Maintenance roles.',
      steps: [
        { title: 'Read the Dashboard', body: 'On the Dashboard, each tool’s card says "Your role:" in that tool. A registered company’s subtitle says your company role, for example Registered company · Manager.', where: 'Dashboard' },
        { title: 'Open ERP roles', body: 'Choose Administration in the rail, then ERP roles. Your roles lists your ERP roles in this company; without a role given, you are a Viewer.', where: 'ERP roles' },
        { title: 'Check Maintenance', body: 'Choose Maintenance in the rail. The page’s subtitle ends with Your role: Administrator, Supervisor, Technician or Requester.', where: 'Maintenance' },
        { title: 'Ask for more if you need it', body: 'Roles are given by the company’s owner and administrators. Tell them what you need to do, not just the role’s name.' },
      ],
    },
    {
      id: 'company-and-tool-roles',
      title: 'Change a person’s company and tool roles',
      outcome: 'The person has the right role in the company and in each of its tools.',
      needs: 'The company’s owner or an administrator. Only the owner makes or changes administrators.',
      steps: [
        { title: 'Open People and roles', body: 'Choose Administration in the rail, then People and roles. The People page lists everyone with their Company role and their role in each tool.', where: 'People and roles' },
        { title: 'Choose a company role', body: 'In the person’s Company role list choose Manager, Employee or Read-only (the owner can also choose Administrator). Each tool’s role is set from that role’s preset.', where: 'Company role' },
        { title: 'Adjust a tool role', body: 'Change one tool’s column if this person needs something else there, for example Accountant in Finance. No access takes them out of that tool.', where: 'No access' },
        { title: 'Check the message', body: 'You see "Saved. The tools are updated." The change applies in the tool at once.' },
      ],
      after: 'For finer control of what a CRM role may do, use Sales and CRM, Settings, Permissions.',
    },
    {
      id: 'erp-roles',
      title: 'Give ERP and Health and Safety roles',
      outcome: 'People can draft, approve, buy, receive, produce, inspect, sell or manage safety in the ERP modules.',
      needs: 'An ERP administrator: the company’s owner or an administrator.',
      steps: [
        { title: 'Open ERP roles', body: 'Choose Administration in the rail, then ERP roles (or WHS roles, which opens the same page).', where: 'ERP roles' },
        { title: 'Read the roles', body: 'The roles explains each one: Engineer, Engineering approver, Buyer, Procurement manager, Warehouse manager, Warehouse operator, Production manager, Production operator, Quality manager, Quality inspector, Sales manager, the WHS roles, Executive and Viewer.', where: 'The roles' },
        { title: 'Tick a person’s roles', body: 'Under People, tick one or more roles for the person. With none ticked, they are a viewer. The owner and administrators are always ERP administrators and cannot be changed here.', where: 'People' },
        { title: 'Save', body: 'Choose Save on that person’s row. You see their name and "roles saved".', where: 'Save' },
      ],
    },
    {
      id: 'maintenance-roles',
      title: 'Give Maintenance roles',
      outcome: 'Supervisors approve requests and technicians see the work orders assigned to them.',
      needs: 'A maintenance administrator. The company’s owner and administrators start as maintenance administrators; everyone else starts as a requester.',
      steps: [
        { title: 'Open Maintenance settings', body: 'Choose Maintenance in the rail, then the Settings tab.', where: 'Settings' },
        { title: 'Find Maintenance roles', body: 'Under Maintenance roles, find the person.', where: 'Maintenance roles' },
        { title: 'Choose the role', body: 'Choose Administrator, Supervisor, Technician or Requester. A technician sees the work orders assigned to them; supervisors and administrators see them all.' },
      ],
    },
    {
      id: 'crm-permissions',
      title: 'Fine-tune what a CRM role may do',
      outcome: 'A CRM role can see, create, edit, delete, import or export exactly what your business needs.',
      needs: 'An owner or administrator of the CRM organisation.',
      steps: [
        { title: 'Open the CRM’s Permissions', body: 'Choose Sales and CRM in the rail, then Settings in the CRM’s menu, then Permissions.', where: 'Permissions' },
        { title: 'Choose a role', body: 'Under Role, choose the role to change, for example Sales Executive.', where: 'Role' },
        { title: 'Set each area', body: 'For leads, contacts, companies, deals and activities, choose All, Own or None for viewing, editing and deleting, and tick Create, Import and Export. Own means records the person owns.', where: 'Own' },
        { title: 'Go back if needed', body: 'Restore the defaults puts the role back as it was. The owner and administrators always have every permission.', where: 'Restore the defaults' },
      ],
    },
  ],
  buttons: [
    { label: 'Company role', does: 'Sets a person’s role in the company and, from its preset, their role in each tool.', when: 'When someone joins or their job changes.', after: '"Saved. The tools are updated."' },
    { label: 'Tool role lists', does: 'Set a person’s role in one tool: Project Management, Sales and CRM or Finance. No access takes them out.', when: 'When one tool needs a different role from the preset.' },
    { label: 'ERP roles', does: 'Opens the ERP roles page: your own roles, and for administrators everyone’s.', when: 'To let people draft, approve, buy, receive, produce, inspect or sell.' },
    { label: 'WHS roles', does: 'Opens the same ERP roles page for the Health and Safety roles.', when: 'To name WHS managers, officers, investigators, representatives and health officers.' },
    { label: 'Save', does: 'Saves one person’s ERP roles.', when: 'After ticking their roles.' },
    { label: 'Maintenance roles', does: 'Gives each person Administrator, Supervisor, Technician or Requester in Maintenance.', when: 'When someone approves requests or does maintenance work.' },
    { label: 'Restore the defaults', does: 'Puts a CRM role’s permissions back to the defaults.', when: 'After changes that went too far.' },
  ],
  faqs: [
    { q: 'What are the five company roles?', a: 'Owner (one per company; owns every tool, transfers ownership and closes the company), Administrator (manages people, departments, invitations and details), Manager, Employee and Read-only (all three see the company and its people). Each sets tool roles by preset: an administrator is Administrator in every tool; a manager is Project manager, Manager and Finance Manager; an employee is Member, Member and Contributor; read-only is Viewer in each.' },
    { q: 'What roles does each tool have?', a: 'Project Management: Administrator, Project manager, Member or Viewer. Sales and CRM: Administrator, Manager, Sales Executive, Member or Viewer. Finance: Administrator, Accountant, Finance Manager, Contributor or Viewer. The owner is the owner of every tool.' },
    { q: 'Why can I not approve something I drafted?', a: 'Segregation of duties: nobody approves a change order they drafted, a supplier they created, a requisition they raised, a purchase order or quotation choice they made, an adjustment they asked for or a count they counted; nobody releases a routing they drafted; nobody approves a corrective action they proposed or are to carry out. Someone else with the right role must do it. In a company of one person (your own company, the example company, or a registered company with one member) you may, and the exception is recorded on the record.' },
    { q: 'Why can I not change my own role?', a: 'Only the owner changes their own role. Everyone else asks the owner, so nobody can give themselves more access.' },
    { q: 'Why can I not make someone an administrator?', a: 'Only the owner makes administrators, of the company or of any tool, and only the owner changes or removes an administrator.' },
    { q: 'I have a role but still see "You do not have permission". Why?', a: 'Each module checks its own job roles. A company role or a tool role does not give ERP or Maintenance roles: for example, buying needs the Buyer or Procurement manager ERP role, and approving maintenance requests needs Supervisor. The message names the roles that may do it (/learn/trouble-access/).' },
    { q: 'Do departments carry permissions?', a: 'No. A department’s head can change who is in it and sees its figures in every tool, but departments do not give access to anything else.' },
    { q: 'Who sees the figures on the Dashboard?', a: 'Each tool’s figures show only to people whose role in that tool shows them. Others see a note in their place.' },
  ],
  related: ['companies', 'company-administration', 'security', 'trouble-access', 'procurement', 'maintenance'],
  workflows: ['engineering-change', 'procure-to-pay', 'maintenance-request-to-work-order'],
  notYet: [
    { text: 'The Members page: module access per person, all, team or own records, sensitive fields such as costs and bank details, suspension of a member, and invitations with modules and a personal message.', status: 'in-development' },
    { text: 'Custom company roles beyond the five presets.', status: 'planned' },
  ],
  keywords: ['permissions', 'access rights', 'user roles', 'admin', 'administrator', 'owner', 'manager', 'employee', 'read only', 'viewer', 'approver', 'segregation of duties', 'SoD', 'four eyes', 'ERP roles', 'WHS roles', 'maintenance roles', 'privileges'],
  sources: [
    'docs/platform/roles.md',
    'docs/platform/members.md',
    'apps/work/src/client/company/lib.ts',
    'apps/work/src/client/company/Pages.tsx',
    'apps/work/src/worker/company/routes.ts',
    'apps/work/src/worker/erp/access.ts',
    'apps/work/src/client/system/erp/Roles.tsx',
    'apps/work/src/client/system/SystemApp.tsx',
    'apps/work/src/worker/maintenance/access.ts',
    'apps/work/src/client/system/maintenance/Maintenance.tsx',
    'apps/work/src/shared/crm/roles.ts',
    'apps/work/src/client/crm/Settings.tsx',
    'apps/work/src/worker/platform/flags.ts',
  ],
  updated: '2026-11-20',
};

export default guide;
