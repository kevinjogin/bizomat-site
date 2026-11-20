import type { Guide } from '../types.ts';

const guide: Guide = {
  id: 'trouble-connections',
  section: 'troubleshooting',
  title: 'Connection problems',
  status: 'live',
  what: 'What to do when CAD Automation cannot reach SOLIDWORKS, an AI app cannot connect, the installer or the Companion misbehaves, or an API token, webhook or calendar feed stops working. Each answer starts from the message you see.',
  purpose: [
    'Get SOLIDWORKS connected again when the assistant says it is not.',
    'Fix an AI app that cannot sign in or picks the wrong computer.',
    'Read the Companion\'s messages and fix pairing.',
    'Fix API tokens, webhooks and the CRM calendar feed.',
  ],
  who: [
    'Engineers using CAD Automation.',
    'IT staff who install and support it.',
    'Developers using API tokens or webhooks.',
    'Sales people using the CRM calendar feed.',
  ],
  access: {
    path: ['CAD Automation', 'Home', 'Connection'],
    href: 'https://bizomat.ai/erp/cad',
    label: 'Open CAD Automation',
    note: "CAD Automation's Home shows the state of SOLIDWORKS, your computers and your AI assistants. Its Documentation page has a full troubleshooting table.",
  },
  tutorials: [
    {
      id: 'solidworks-not-connected',
      title: 'Fix "SOLIDWORKS is not connected"',
      outcome: 'Your assistant reaches SOLIDWORKS on your computer again.',
      steps: [
        {
          title: 'Look at Home',
          body: 'In CAD Automation, the Connection panel on Home shows SOLIDWORKS, Computers and AI assistants: Connected, Disconnected, Checking connection, Authentication required, Installation required or Connection error. It updates every few seconds.',
          where: 'Connection',
        },
        {
          title: 'Check the Companion is running',
          body: 'Look for the Companion\'s icon in the Windows taskbar. If it is missing, start BIZOMAT Companion from the Start menu, and in its tray menu tick Start with Windows.',
          where: 'Start with Windows',
        },
        {
          title: 'Check it is paired and not paused',
          body: 'If the Companion says Not registered, choose Pair this computer... in its tray menu. If CAD Automation is paused, choose Resume CAD Automation.',
          where: 'Resume CAD Automation',
        },
        {
          title: 'Check SOLIDWORKS and the add-in',
          body: 'Open SOLIDWORKS normally, not as administrator. If there is no BIZOMAT tab, open Tools > Add-Ins and tick BIZOMAT CAD Automation under Active and Start Up. If it is still missing, repair the installation in Windows Settings > Apps.',
          where: 'Tools > Add-Ins',
        },
        {
          title: 'Ask for a check',
          body: 'Ask your assistant: "Check the CAD Automation connection to SOLIDWORKS." It says which computer and SOLIDWORKS version it reached, or what is missing.',
        },
        {
          title: 'Collect diagnostics if it still fails',
          body: 'Right-click the Companion\'s icon, choose Status... and then Copy diagnostics. They hold no passwords or keys. Send them to BIZOMAT support through the contact page.',
          where: 'Copy diagnostics',
        },
      ],
      after: 'Once Home shows Connected, run the self test again: "Run the SOLIDWORKS self test, all three stages."',
    },
    {
      id: 'ai-app-cannot-connect',
      title: 'Fix an AI app that cannot connect',
      outcome: 'Your AI app is connected to CAD Automation and listed under Connected assistants.',
      steps: [
        { title: 'Copy the address again', body: 'In CAD Automation, open CAD Assistant and copy the Connector address. It ends in /mcp.', where: 'Connector address' },
        { title: 'Add the connector again', body: 'In your AI app, remove the CAD Automation connector, add it again with the address, sign in and choose Allow.', where: 'Allow' },
        { title: 'Check the list', body: 'CAD Assistant lists the app under Connected assistants once you have chosen Allow.', where: 'Connected assistants' },
        {
          title: 'Ask your workspace administrator',
          body: 'In ChatGPT and some other apps, a workspace administrator must allow custom connectors before you can add one.',
        },
        {
          title: 'Use the private address as a last resort',
          body: 'If the app cannot sign in at all, use the private connector address from CAD Automation\'s Settings. Anyone who has it can use your CAD connection, so keep it to yourself.',
          where: 'Private connector address',
        },
      ],
      after: 'Then ask the app to check the connection to SOLIDWORKS.',
    },
  ],
  faqs: [
    {
      q: 'There is no Companion icon in the taskbar after signing in to Windows.',
      a: 'Start BIZOMAT Companion from the Start menu. In its tray menu, tick Start with Windows so it starts by itself next time.',
    },
    {
      q: 'The Companion says Not registered.',
      a: 'The computer is not paired. Open the tray menu and choose Pair this computer..., then pair it with your email and password or in the browser.',
    },
    {
      q: 'The Companion says the computer was removed.',
      a: 'It was removed from your account, on the SOLIDWORKS page or by an administrator. Pair it again; it gets a new key.',
    },
    {
      q: 'The Companion says Offline, retrying.',
      a: 'It cannot reach CAD Automation. Check that the service address (https://bizomat.ai/cad unless your organisation runs its own) opens in a browser on that computer. Behind a company proxy, ask IT to allow that address. The Companion retries by itself.',
    },
    {
      q: 'A signed request is refused with TOKEN_EXPIRED.',
      a: "The computer's clock is wrong. Turn on automatic time in Windows Settings.",
    },
    {
      q: 'The Companion says Connected, SOLIDWORKS closed.',
      a: 'This is normal. Open SOLIDWORKS when you want the assistant to work.',
    },
    {
      q: 'It says it is waiting for the add-in, or SOLIDWORKS has no BIZOMAT tab.',
      a: 'In SOLIDWORKS, open Tools > Add-Ins and tick BIZOMAT CAD Automation (CADOS before version 0.13) under Active and Start Up. Do not run SOLIDWORKS as administrator. If it is still missing, repair the installation: Windows Settings > Apps > BIZOMAT CAD Automation for SOLIDWORKS > Modify > Repair.',
    },
    {
      q: 'Windows says it protected my PC when I open the installer.',
      a: 'The early access installer is not code-signed yet. Check that you downloaded it from bizomat.ai (the download needs you signed in to CAD Automation), then choose More info, Run anyway, or ask your IT team.',
    },
    {
      q: 'The assistant says several computers are connected.',
      a: 'Name the computer in your request, for example "on DESK-02", or set a default on CAD Automation\'s SOLIDWORKS page with Make default.',
    },
    {
      q: 'The assistant says none of my computers is online, or a computer is offline.',
      a: 'Turn the computer on and sign in to Windows: the Companion connects by itself. Then open SOLIDWORKS. If you named a computer, check its name on the SOLIDWORKS page.',
    },
    {
      q: 'The assistant says CAD Automation is paused on a computer.',
      a: 'Someone at that computer paused it. They resume it from the Companion\'s icon in the Windows taskbar: Resume CAD Automation.',
    },
    {
      q: 'The assistant says SOLIDWORKS has a dialog box open, or a sketch is open for editing.',
      a: 'Close the dialog box, or exit the sketch, in SOLIDWORKS, then ask again.',
    },
    {
      q: 'The assistant says the person at the computer declined.',
      a: 'A destructive change, such as a delete or an undo, was declined, or nobody answered the BIZOMAT: confirm window within two minutes. Ask again and choose Allow once.',
    },
    {
      q: 'The assistant says the command is still working.',
      a: 'Long operations finish by themselves on your computer. The assistant can follow the command to the end or cancel it.',
    },
    {
      q: 'The AI app cannot sign in.',
      a: 'Remove the connector in the app and add it again. If it still fails, use the private address from CAD Automation\'s Settings (see /learn/cad-ai-connection/).',
    },
    {
      q: 'BIZOMAT ERP says CAD Automation is not reporting yet, or lists no computers.',
      a: 'The ERP shows computers only once CAD Automation reports them, a few minutes after pairing, and only for accounts with a confirmed email address. Until then, choose See my computers to open them in CAD Automation (see /learn/cad-automation/).',
    },
    {
      q: 'My API token stopped working.',
      a: 'An expired, revoked or ended token gets "Authentication required": every token ends when you change your password, and new tokens expire (90 days unless you chose otherwise). "This API token is limited to one company, and this address is not in it." means it is calling another company. "This API token can only read." and "This API token is not allowed to use this application." mean it was made with those limits. Make a new token in Project Management, Settings, Security (see /learn/integrations/).',
    },
    {
      q: 'A webhook, Slack or Teams integration shows Delivery failing.',
      a: 'The last delivery to its address failed. In Project Management, Integrations, choose Deliveries to see the error, check the address still works, and choose Send test. It shows Connected again after a delivery succeeds.',
    },
    {
      q: 'My CRM calendar feed stopped updating.',
      a: 'Calendar programs refresh a subscribed calendar every few hours. If you made a new address, the old one stopped: subscribe to the new one. Stop the address ends it for good.',
    },
    {
      q: 'Invitations and notifications do not arrive by email.',
      a: "BIZOMAT sends email only where the service's email is set up, and each person chooses which notifications come by email. When email is not set up, invitations show a link to share and notifications stay in the app (see /learn/notifications/).",
    },
  ],
  related: ['cad-automation', 'cad-ai-connection', 'integrations', 'notifications', 'trouble-sign-in'],
  notYet: [
    { text: 'CAD Automation set up and checked from inside BIZOMAT ERP, by company: built, but switched off for now.', status: 'in-development' },
  ],
  keywords: ['offline', 'not connected', 'SOLIDWORKS', 'Companion', 'add-in', 'pairing', 'installer', 'SmartScreen', 'MCP', 'connector', 'AI app', 'API token', 'webhook', 'calendar feed', 'proxy', 'diagnostics'],
  sources: [
    'apps/cad/opensketch/site.py',
    'apps/cad/opensketch/app_pages.py',
    'apps/cad/opensketch/swbridge.py',
    'apps/cad/opensketch/devicebridge.py',
    'apps/cad/opensketch/static/ui/app.js',
    'apps/cad/solidworks/src/Companion/Tray.cs',
    'apps/cad/solidworks/src/Addin',
    'apps/cad/CLAUDE.md',
    'apps/work/src/client/system/SystemApp.tsx',
    'apps/work/src/worker/platform/context.ts',
    'apps/work/src/worker/routes/me.ts',
    'apps/work/src/client/pages/Integrations.tsx',
    'apps/work/src/client/crm/Settings.tsx',
  ],
  updated: '2026-11-20',
};

export default guide;
