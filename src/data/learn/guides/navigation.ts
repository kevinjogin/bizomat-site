import type { Guide } from '../types.ts';

// Finding your way around BIZOMAT ERP. Facts: the module rail and "Report a fault"
// (apps/work/src/client/components/layout/SuiteRail.tsx, apps/work/src/client/system/maintenance/ReportFault.tsx and
// Requests.tsx), the top bar, company switcher and side menu (apps/work/src/client/system/SystemApp.tsx: Shell,
// CompanySwitcher, ThemeButton, Profile), the phone layout (apps/work/src/client/styles/app.css) and the company being
// worked in (apps/work/src/client/lib/company-context.ts). The new look is behind the flag new_ui_enabled (off).
const guide: Guide = {
  id: 'navigation',
  section: 'getting-started',
  title: 'Finding your way around',
  short: 'Navigation',
  status: 'live',
  what: 'Every screen of BIZOMAT ERP has the same frame: the module rail on the left, a top bar with the company switcher and your profile, and the menu of the page you are in. This guide shows where each control is, on a computer and on a phone.',
  purpose: [
    'Move between modules with the module rail.',
    'Change the company you are working in.',
    'Find Procurement, Inventory, Manufacturing, Quality and Supply Chain in the side menu or on Operations.',
    'Report a fault from any screen.',
    'Use BIZOMAT ERP on a phone.',
  ],
  who: ['Everyone who uses BIZOMAT ERP', 'New staff in their first week', 'People who work on a phone in the warehouse, on the shop floor or on site'],
  access: {
    path: ['BIZOMAT ERP', 'Dashboard'],
    href: 'https://bizomat.ai/erp/',
    label: 'Open BIZOMAT ERP',
  },
  tutorials: [
    {
      id: 'use-the-rail',
      title: 'Move between modules with the rail',
      outcome: 'You can open any module and come back to the Dashboard.',
      steps: [
        { title: 'Find the rail', body: 'The dark bar on the left of every screen is the module rail. The BIZOMAT mark at its top opens the Dashboard.', where: 'Dashboard' },
        { title: 'Open a module', body: 'Choose an entry: Dashboard, My Work, Sales and CRM, Finance and Accounting, Projects and Tasks, Products and Engineering, Maintenance, Health and Safety, Operations, Reports or Administration. The entry you are in is highlighted.', where: 'Projects and Tasks' },
        { title: 'Read a module’s description', body: 'Rest the pointer on an entry to see what it holds, for example "Reports: every report of your tools in one place".' },
        { title: 'Use the module’s own menu', body: 'Each tool keeps its own menu next to the rail. In Sales and CRM it lists Overview, Leads, Contacts, Companies, Deals and more; in Projects and Tasks, Home, My Work, Inbox, Boards and more.' },
        { title: 'Open the operations modules', body: 'Choose Operations in the rail. Each card opens one module: Procurement, Inventory, Manufacturing, Quality, Supply Chain, Maintenance or Products and Engineering.', where: 'Operations' },
      ],
    },
    {
      id: 'top-bar-and-side-menu',
      title: 'Use the top bar and the side menu',
      outcome: 'You can switch company, open your profile and reach every ERP page from the side menu.',
      steps: [
        { title: 'Switch company', body: 'In the top bar, choose the company’s name. The list shows Your companies, then Shared with you, then Example company, and Register a company at the bottom. Choose a company to open its Dashboard.', where: 'Your companies' },
        { title: 'Read the side menu', body: 'On the ERP’s own pages the side menu lists Dashboard, Products and Engineering, Procurement, Inventory, Manufacturing, Quality, Supply Chain, Maintenance, Health and Safety and Company, for the company you are in.', where: 'Company' },
        { title: 'Open a tool from the side menu', body: 'Under Open a tool, the side menu lists the company’s Projects and Tasks, Sales and CRM and Finance and Accounting that you belong to.', where: 'Open a tool' },
        { title: 'Open the profile menu', body: 'Choose your picture or initials at the right of the top bar: Profile and security opens your account settings, and Sign out ends your session.', where: 'Profile and security' },
        { title: 'Change the theme', body: 'The sun or moon button in the top bar switches between Light, Dark and Match this computer.', where: 'Theme' },
      ],
    },
    {
      id: 'report-a-fault',
      title: 'Report a fault from any screen',
      outcome: 'A maintenance request is sent without leaving the page you were on.',
      steps: [
        { title: 'Choose Report a fault', body: 'At the foot of the module rail, choose Report a fault. A window opens over the page.', where: 'Report a fault' },
        { title: 'Choose the company', body: 'If you are in more than one company, choose it under Company. The company you are working in is chosen for you.', where: 'Company' },
        { title: 'Say what is wrong', body: 'Fill in What is wrong, or what needs doing? Pick the asset under Asset (if you know it), and add a photo under Photos or documents.', where: 'What is wrong, or what needs doing?' },
        { title: 'Add more if you like', body: 'Priority, location and more opens Priority, Requested-by date, Location, Department and Notes.', where: 'Priority, location and more' },
        { title: 'Send it', body: 'Choose Send the request. You see the request’s number and whether it waits for a supervisor’s approval or is already with the maintenance team.', where: 'Send the request' },
        { title: 'Open it or go on', body: 'Choose Open with the request’s number to follow it, Report another, or Close to go back to your page.', where: 'Report another' },
      ],
      after: 'Follow the request in Maintenance (/learn/maintenance/).',
    },
    {
      id: 'on-a-phone',
      title: 'Work on a phone',
      outcome: 'You can use BIZOMAT ERP in a phone’s browser.',
      steps: [
        { title: 'Open the ERP in the browser', body: 'Go to bizomat.ai/erp in the phone’s browser and sign in. There is no app to install.' },
        { title: 'Use the bar at the bottom', body: 'On a phone the module rail becomes a bar along the bottom of the screen. Swipe it sideways to reach Reports, Administration and Report a fault.', where: 'Report a fault' },
        { title: 'Open the side menu', body: 'Choose the menu button at the left of the top bar to show or hide the side menu.', where: 'Toggle navigation' },
        { title: 'Change the theme', body: 'The theme button is hidden on a phone: open Profile and security and use Theme on this computer.', where: 'Theme on this computer' },
      ],
      after: 'The warehouse screen, the shop floor, inspections, prestart checks and hazard reports are made for phones (see each module’s guide).',
    },
    {
      id: 'company-follows-you',
      title: 'Open the right company’s tools',
      outcome: 'Sales and CRM, Finance and Accounting, Projects and Tasks and My Work open the company you chose.',
      steps: [
        { title: 'Choose the company first', body: 'In the company switcher, choose the company you want to work in. Its Dashboard opens.' },
        { title: 'Open a tool from the rail', body: 'Choose Sales and CRM, Finance and Accounting, Projects and Tasks or My Work. Each opens that company’s own tool.', where: 'Sales and CRM' },
        { title: 'When a company has no such tool', body: 'If the company has no CRM, for example, Sales and CRM opens the CRM you used last instead, or the CRM’s start page if you have none. Check the name at the top of the tool before you add records.' },
      ],
      after: 'The company you chose is remembered on this computer, for the rail and Report a fault. The server still checks your access every time.',
    },
  ],
  buttons: [
    { label: 'Module rail', does: 'Opens a module of the company you are working in.', when: 'Any time, from any screen.', after: 'The module opens with the rail still beside it.' },
    { label: 'Company switcher', does: 'Lists your companies, companies that shared a tool with you and your example company; Register a company is at the bottom.', when: 'To work in another company.', after: 'The chosen company’s Dashboard opens, and nothing of the previous company stays on screen.' },
    { label: 'Report a fault', does: 'Opens a short form for a maintenance request.', when: 'Something is broken or needs maintenance.', after: 'The request goes to the company’s maintenance team, or to a supervisor for approval first.' },
    { label: 'Operations', does: 'Shows the operations modules and what waits in the company.', when: 'To open Procurement, Inventory, Manufacturing, Quality, Supply Chain or Maintenance.' },
    { label: 'Open a tool', does: 'The side menu’s list of the company’s tools you belong to.', when: 'To jump to a particular Projects and Tasks workspace, CRM or Finance workspace.' },
    { label: 'Profile menu', does: 'Holds Profile and security and Sign out.', when: 'To change your account settings or end your session.' },
    { label: 'Theme', does: 'Light, Dark or Match this computer.', when: 'On a computer; on a phone use Profile and security.' },
    { label: 'Toggle navigation', does: 'Shows or hides the side menu on a narrow screen.', when: 'On a phone or a small window.' },
  ],
  faqs: [
    { q: 'Why did Sales and CRM open another company’s CRM?', a: 'The rail opens the tools of the company you last opened on this computer. Choose the company you want in the company switcher first, then choose Sales and CRM again. If that company has no CRM, the CRM you used last opens instead.' },
    { q: 'Where are Procurement, Inventory, Manufacturing, Quality and Supply Chain?', a: 'They are not in the rail. Open them from Operations in the rail, or from the side menu on the ERP’s own pages.' },
    { q: 'Why does the menu look different inside Sales and CRM or Projects and Tasks?', a: 'Each tool keeps its own menu and top bar. The module rail stays on the left, so you can always get back to the Dashboard or another module.' },
    { q: 'I do not see Company Admin or CAD Automation in the menus. Why?', a: 'Company Admin shows only for the owner and administrators of a registered company where the Company Admin console is switched on, which it is not yet. CAD Automation is under Products and Engineering; it gets its own side menu entry only where it works inside the ERP for the company (/learn/cad-automation/).' },
    { q: 'A module says it is off for this company. What does that mean?', a: 'A BIZOMAT platform administrator can switch a module off for a company. Its pages then say the module is off for that company. Ask BIZOMAT support through bizomat.ai/contact/ (/learn/trouble-access/).' },
    { q: 'My old bookmarks go to bizomat.ai/tasks, /crm or /finance. Do they still work?', a: 'Yes. Those addresses forward to the same page inside BIZOMAT ERP, at bizomat.ai/erp/tasks, /erp/crm and /erp/finance.' },
    { q: 'Who can use Report a fault?', a: 'Anyone who works in a company, whatever their role. People who were only added to one of a company’s tools do not see its maintenance, and the window says "You are not in a company with maintenance yet." when there is no company to report to.' },
  ],
  related: ['what-is-bizomat', 'account-and-sign-in', 'companies', 'dashboard', 'maintenance'],
  workflows: ['maintenance-request-to-work-order'],
  notYet: [
    { text: 'A new look for the website and BIZOMAT ERP, with a Comfortable or Compact density saved on your account.', status: 'in-development' },
  ],
  keywords: ['menu', 'sidebar', 'side menu', 'rail', 'module rail', 'navigation bar', 'top bar', 'switch company', 'mobile', 'phone', 'tablet', 'report a fault', 'breakdown', 'where is'],
  sources: [
    'apps/work/src/client/components/layout/SuiteRail.tsx',
    'apps/work/src/client/system/SystemApp.tsx',
    'apps/work/src/client/lib/company-context.ts',
    'apps/work/src/client/system/maintenance/ReportFault.tsx',
    'apps/work/src/client/system/maintenance/Requests.tsx',
    'apps/work/src/client/components/layout/AppShell.tsx',
    'apps/work/src/client/crm/CrmApp.tsx',
    'apps/work/src/client/styles/app.css',
    'apps/work/src/worker/platform/flags.ts',
    'docs/platform/members.md',
    'docs/ui/README.md',
  ],
  updated: '2026-11-20',
};

export default guide;
