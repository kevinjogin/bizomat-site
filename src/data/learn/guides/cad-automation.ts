import type { Guide } from '../types.ts';

const guide: Guide = {
  id: 'cad-automation',
  section: 'cad',
  title: 'CAD Automation',
  status: 'live',
  what: 'CAD Automation connects an AI assistant, such as Claude or ChatGPT, to SOLIDWORKS on your own Windows computer. You describe a part, a change, an assembly, a drawing or a check, and the assistant builds native, editable SOLIDWORKS features in your own files.',
  purpose: [
    'Make new parts from a plain-language description.',
    'Change existing parts: dimensions, global variables, equations and features.',
    'Build assemblies with standard screws, nuts, washers and bearings, mates and an interference check.',
    'Make native SOLIDWORKS drawings and export them as PDF, DWG or DXF.',
    'Measure and inspect models, and import or export STEP, IGES, Parasolid and STL files.',
  ],
  who: [
    'Mechanical design engineers and drafters who use SOLIDWORKS.',
    'Engineering managers who set CAD Automation up for a team.',
    'Company owners and administrators who see the company\'s CAD computers in BIZOMAT ERP.',
    'IT staff who install it on Windows computers.',
  ],
  access: {
    path: ['BIZOMAT ERP', 'Products and Engineering', 'CAD Automation'],
    href: 'https://bizomat.ai/erp/cad',
    label: 'Open CAD Automation in BIZOMAT ERP',
    note: "The ERP's CAD Automation tab shows the set-up steps and your company's computers. CAD Automation's own pages (Home, CAD Assistant, SOLIDWORKS, Tools, History and Settings) are at https://bizomat.ai/cad/, where you sign in with Continue with BIZOMAT.",
  },
  tutorials: [
    {
      id: 'set-up',
      title: 'Set CAD Automation up',
      outcome: 'Your computer is paired, SOLIDWORKS has the add-in, your AI assistant is connected, and a check says it all works.',
      needs: 'Windows 10 (version 1903 or later) or Windows 11, 64-bit; SOLIDWORKS 2022 or later, 64-bit; administrator approval on the computer once, for the installation; an AI app that supports MCP connectors.',
      steps: [
        {
          title: 'Open the set-up steps',
          body: 'In BIZOMAT ERP, open Products and Engineering and choose the CAD Automation tab. It lists the steps under "Set it up in four steps", with links into CAD Automation.',
          where: 'Set it up in four steps',
        },
        {
          title: 'Sign in to CAD Automation',
          body: 'Open bizomat.ai/cad and choose Continue with BIZOMAT. It uses the same BIZOMAT account as the ERP: there is no second account to make.',
          where: 'Continue with BIZOMAT',
        },
        {
          title: 'Download and install',
          body: 'On the SOLIDWORKS page, choose Download for SOLIDWORKS. Save your work and close SOLIDWORKS, then run BIZOMAT-CAD-Automation-x64.msi. Windows asks for administrator approval once. One installer adds the SOLIDWORKS add-in and the Companion, a small tray app that starts with Windows. The early access installer is not code-signed yet, so Windows may warn you: check that you downloaded it from bizomat.ai, then choose More info, Run anyway, or ask your IT team.',
          where: 'Download for SOLIDWORKS',
        },
        {
          title: 'Pair the computer',
          body: 'After the install, the Companion opens its pairing window. Check the CAD Automation address and the name for this computer. Then either enter the email and password you sign in to CAD Automation with and choose Pair, or leave them empty and choose Pair: your browser opens CAD Automation, you check it shows the same code, and choose Add this computer. If you sign in with Continue with BIZOMAT, use the browser.',
          where: 'Pair',
        },
        {
          title: 'Open SOLIDWORKS',
          body: 'Open SOLIDWORKS normally (not as administrator). The add-in loads by itself and adds a BIZOMAT tab, a BIZOMAT menu and the BIZOMAT CAD Automation task pane.',
        },
        {
          title: 'Connect your AI assistant',
          body: 'In CAD Automation, open CAD Assistant, copy the Connector address and add it as a custom connector in Claude, ChatGPT or another MCP app. Sign in and choose Allow (see /learn/cad-ai-connection/).',
          where: 'Connector address',
        },
        {
          title: 'Check it works',
          body: 'Ask your assistant: "Check the CAD Automation connection to SOLIDWORKS." It says which computer and SOLIDWORKS version it reached. Then ask: "Run the SOLIDWORKS self test, all three stages." It reports each step as ok, check or failed, with the reason.',
        },
      ],
      after: "CAD Automation's Home shows the state of SOLIDWORKS, your computers and your AI assistants, and a Get set up list that ticks off as you go.",
    },
    {
      id: 'first-part',
      title: 'Make your first part',
      outcome: 'A new, native SOLIDWORKS part is built and saved on your computer from your description.',
      needs: 'CAD Automation set up, SOLIDWORKS open on a paired computer and an AI assistant connected.',
      steps: [
        {
          title: 'Describe the task',
          body: 'On CAD Automation\'s Home, under Start an engineering task, type what you need, or choose an example such as "Make a 60 x 40 x 8 mm mounting plate with four M5 clearance holes, 6 mm in from each corner."',
          where: 'Start an engineering task',
        },
        {
          title: 'Hand it to your assistant',
          body: 'Choose Copy task, then Open Claude or Open ChatGPT, and paste it there. Or type straight into your connected assistant.',
          where: 'Copy task',
        },
        {
          title: 'Let it build in checked steps',
          body: 'The assistant checks the connection, reads the working guide, then builds in small stages. Each sketch is solved and each feature rebuilt on BIZOMAT\'s geometry kernel before it reaches SOLIDWORKS. If one step of a stage fails, the whole stage is taken back.',
        },
        {
          title: 'Watch it in SOLIDWORKS',
          body: 'The features appear in SOLIDWORKS, and the task pane shows the activity. The assistant compares the volume and size it expected with what SOLIDWORKS made.',
          where: 'Activity',
        },
        {
          title: 'Confirm destructive changes',
          body: 'Deleting features, undoing, saving over a file, replacing a drawing or removing a variable opens a BIZOMAT: confirm window in SOLIDWORKS. Choose Allow once or Deny. No answer within two minutes means no.',
          where: 'Allow once',
        },
        {
          title: 'Save',
          body: 'A new part is saved when it is made. Later changes are saved when you save in SOLIDWORKS or ask the assistant to save.',
        },
      ],
      after: 'History lists each command sent to your computer: what, which computer, which assistant and how it ended.',
    },
    {
      id: 'drawing-export',
      title: 'Make a drawing and export it',
      outcome: 'A native SOLIDWORKS drawing is saved next to your model, and you have a PDF, DWG or DXF of it.',
      needs: 'A saved part or assembly open in SOLIDWORKS.',
      steps: [
        { title: 'Save the model first', body: 'A drawing is made of a saved part or assembly. Save it, or ask the assistant to save it.' },
        {
          title: 'Ask for the drawing',
          body: 'Ask, for example: "Create an A3 drawing of the open part with the standard views, an isometric and the model dimensions." It uses your default drawing template, third angle unless you ask for first angle, a preferred scale that fits, and fills the title block fields.',
        },
        {
          title: 'Refine it',
          body: 'Ask for section, detail or projected views, notes or a bill of materials, or to move or rescale a view, for example: "Add a section view through the centre of the front view."',
        },
        { title: 'Check it', body: 'The assistant reads the sheet back and can take a screenshot to check that every view is on the sheet.' },
        {
          title: 'Export it',
          body: 'Ask: "Export the drawing as PDF" (every sheet), or as DWG or DXF (the active sheet). The assistant gives you a download link that works for one hour.',
        },
      ],
      after: 'To keep the file in BIZOMAT ERP, upload it as an engineering document on the product (see /learn/products/).',
    },
    {
      id: 'computers-history',
      title: 'Manage your computers and see what was done',
      outcome: 'You know which computers are paired, which is the default, and what your assistant did on each.',
      steps: [
        {
          title: 'See your computers',
          body: 'In CAD Automation, open SOLIDWORKS. Your computers lists each paired computer and whether it is online with SOLIDWORKS open.',
          where: 'Your computers',
        },
        { title: 'Choose a default', body: 'When you use more than one computer, choose Make default on the one the assistant should use when you do not name one.', where: 'Make default' },
        { title: 'Remove a computer', body: 'Choose Remove for a computer you no longer use, or one that was lost. It stops working at once.', where: 'Remove' },
        {
          title: 'See the history',
          body: 'Open History: When, What, Computer, Assistant and Result for each command, newest first. Choose Refresh for the latest. Commands over the direct link (without the Companion) are not recorded.',
          where: 'History',
        },
        {
          title: "See the company's computers in the ERP",
          body: "In BIZOMAT ERP, Products and Engineering, CAD Automation shows Computers in your company, with each person's computers, AI apps and recent jobs once CAD Automation reports them. Choose Refresh for the latest. If it says CAD Automation is not reporting to the ERP yet, choose See my computers.",
          where: 'See my computers',
        },
      ],
      after: 'In a registered company, the owner and administrators see everyone\'s CAD computers; members see their own; people in other companies see none.',
    },
  ],
  buttons: [
    { label: 'Open CAD Automation', does: "From BIZOMAT ERP's Products and Engineering, opens CAD Automation at bizomat.ai/cad.", when: 'You need its own pages: Home, CAD Assistant, SOLIDWORKS, Tools, History, Settings.' },
    { label: 'Continue with BIZOMAT', does: 'Signs you in to CAD Automation with your BIZOMAT account.', after: 'You confirm on bizomat.ai and return to CAD Automation signed in.' },
    { label: 'Download for SOLIDWORKS', does: 'Downloads the Windows installer (add-in and Companion).', when: 'You set up a new computer or update one.', after: 'Run it with SOLIDWORKS closed.' },
    { label: 'Pair this computer...', does: "From the Companion's tray icon, opens the pairing window.", when: 'The Companion says Not registered, or the computer was removed.' },
    { label: 'Pause CAD Automation', does: "From the Companion's tray icon, stops commands reaching this computer until you choose Resume CAD Automation.", when: 'You want to work in SOLIDWORKS without the assistant.' },
    { label: 'Copy task', does: 'Copies the task you typed on Home, ready to paste into your assistant.', after: 'Open Claude and Open ChatGPT copy it first, then open the app.' },
    { label: 'Allow once', does: 'In the BIZOMAT: confirm window in SOLIDWORKS, lets one destructive change go ahead. Deny refuses it.', after: 'No answer within two minutes counts as no.' },
    { label: 'Make default', does: 'Makes a computer the one used when more than one is online and you do not name one.' },
    { label: 'Remove', does: 'Takes a computer off your account.', after: 'Its key stops working at once; pair it again to use it.' },
    { label: 'Copy diagnostics', does: "From the Companion's Status window, copies details for support. They hold no passwords or keys.", when: 'You need help with a connection problem.' },
  ],
  faqs: [
    {
      q: 'Does CAD Automation have its own AI?',
      a: 'No. Your AI assistant does the work. CAD Automation gives it the SOLIDWORKS tools, checks every sketch and feature before it is sent, and runs the work on your computer.',
    },
    {
      q: 'Where are my model files kept?',
      a: 'On your computer. SOLIDWORKS runs there, with your licence and your files, and is the master copy of every model. Commands, results and short-lived geometry copies used to check and measure your model pass through CAD Automation\'s service; exports are kept for one hour.',
    },
    {
      q: 'Which SOLIDWORKS versions work?',
      a: 'SOLIDWORKS 2022, 64-bit, is supported: the add-in is built against its API. 2023 to 2026 are expected to work but are not yet validated. 2021 and older are not supported, and neither is running SOLIDWORKS as administrator. Run the self test once on each computer and version you use.',
    },
    {
      q: 'Does anything connect in to my computer?',
      a: 'No. The Companion connects out over HTTPS and opens no ports. The computer signs each request with its own key, kept in the Windows key store, and checks each command before SOLIDWORKS sees it.',
    },
    {
      q: 'Can the assistant delete my work?',
      a: 'Not without you. Deleting features, undoing, saving over a file, replacing a drawing or removing a variable asks you in SOLIDWORKS first. This is on by default (Ask me before destructive changes, in the task pane).',
    },
    {
      q: 'I have a new computer, or one was lost. What do I do?',
      a: 'On the SOLIDWORKS page, remove the old computer: it stops working at once. Then install and pair the new one. Nothing needs to be copied.',
    },
    {
      q: 'Do I need a separate CAD Automation account?',
      a: 'No. Choose Continue with BIZOMAT on its sign-in page. A CAD Automation account made before is linked to your BIZOMAT account when both have the same confirmed email address.',
    },
    {
      q: 'Why does BIZOMAT ERP not list my computers?',
      a: 'The ERP lists computers only after CAD Automation reports them, which can take a few minutes after pairing, and only for accounts with a confirmed email address: sign in with BIZOMAT once to confirm yours. If the page says CAD Automation is not reporting to the ERP yet, use See my computers. The example company has no CAD computers.',
    },
    {
      q: 'What are the known limits?',
      a: 'It is early access: built against the SOLIDWORKS 2022 API and not yet run on many installations. An AI app that ends a tool call after about a minute can stop the self test after its first step, leaving an unsaved test part. Some reads are slow, for example a fillet with its check, or a status read with many documents open. A default drawing template without a sheet format shows no title block. Export links last one hour.',
    },
    {
      q: 'Is CAD Automation charged for?',
      a: 'No. CAD Automation is free.',
    },
  ],
  related: ['cad-ai-connection', 'products', 'trouble-connections', 'integrations'],
  workflows: ['cad-to-product', 'engineering-change'],
  notYet: [
    { text: 'CAD Automation as its own module inside BIZOMAT ERP, with computers, AI assistants, history, exports and set-up done in place, by company. Built, but switched off for customers.', status: 'in-development' },
    { text: 'Saving an export straight to a product revision, a bill of materials proposal from an open assembly, drawings on manufacturing orders, NCRs and inspection plans, and review tasks in Projects.', status: 'in-development' },
    { text: 'Making a drawing from an ERP product.', status: 'planned' },
  ],
  keywords: ['CADOS', 'SOLIDWORKS', 'AI CAD', 'add-in', 'Companion', 'installer', 'MSI', 'pairing', 'drawing', 'STEP', 'DWG', 'DXF', 'self test', 'Engineering Automation', 'MCP'],
  sources: [
    'apps/cad/CLAUDE.md',
    'apps/cad/opensketch/app_pages.py',
    'apps/cad/opensketch/site.py',
    'apps/cad/opensketch/catalog.py',
    'apps/cad/opensketch/auth.py',
    'apps/cad/opensketch/sw_tools.py',
    'apps/cad/solidworks/src/Companion/Tray.cs',
    'apps/cad/solidworks/src/Addin',
    'apps/work/src/client/system/SystemApp.tsx',
    'apps/work/src/client/system/erp/Products.tsx',
    'apps/work/src/worker/system/routes.ts',
    'apps/work/src/worker/platform/flags.ts',
    'docs/cad/README.md',
    'src/data/platform-catalog.ts',
    'src/data/cad-tools.ts',
  ],
  updated: '2026-11-20',
};

export default guide;
