import type { Guide } from '../types.ts';

const guide: Guide = {
  id: 'cad-ai-connection',
  section: 'cad',
  title: 'Connect an AI app to CAD Automation',
  short: 'AI app connection',
  status: 'live',
  what: 'Claude, ChatGPT or another app that supports remote MCP connectors connects to CAD Automation through one connector address, https://bizomat.ai/cad/mcp. You sign in and approve the app once; it can then use CAD Automation\'s SOLIDWORKS tools as you, on your own computers.',
  purpose: [
    'Give your AI app the SOLIDWORKS tools: parts, assemblies, drawings, checks and files.',
    'Approve each AI app yourself, on a consent page.',
    'Choose which of your computers the work goes to.',
    'See which apps are connected, and disconnect one at any time.',
    'Connect an app that cannot sign in, with a private address.',
  ],
  who: [
    'Engineers who use Claude, ChatGPT or another AI app with SOLIDWORKS.',
    'Administrators of an AI app workspace who allow custom connectors.',
    'IT staff who set up connections for a team.',
  ],
  access: {
    path: ['CAD Automation', 'CAD Assistant', 'Connect your assistant'],
    href: 'https://bizomat.ai/erp/cad',
    label: 'Open CAD Automation',
    note: 'Sign in with Continue with BIZOMAT, then open CAD Assistant. The Connector address is shown there with Copy.',
  },
  tutorials: [
    {
      id: 'connect-claude',
      title: 'Connect Claude',
      outcome: 'Claude lists the CAD Automation connector and can work in SOLIDWORKS on your computer.',
      needs: 'A CAD Automation account (Continue with BIZOMAT) and a Claude plan that allows custom connectors.',
      steps: [
        { title: 'Copy the connector address', body: 'In CAD Automation, open CAD Assistant. Under Connect your assistant, choose Copy next to Connector address. The address ends in /mcp.', where: 'Connector address' },
        { title: 'Add a custom connector', body: 'In Claude, open Settings, Connectors and choose Add custom connector.', where: 'Add custom connector' },
        { title: 'Name it and paste the address', body: 'Name it, for example BIZOMAT CAD Automation, and paste the connector address.' },
        { title: 'Connect and sign in', body: 'Choose Connect. CAD Automation opens in your browser: sign in with Continue with BIZOMAT if you are not signed in already.' },
        {
          title: 'Approve the app',
          body: 'The page "Connect" and the app\'s name says what it will be able to do: work in SOLIDWORKS on your computers through CAD Automation; create and change parts, assemblies and drawings; import, measure, preview and export your models. It shows who you are signed in as and where you return to. Choose Allow, or Cancel to refuse.',
          where: 'Allow',
        },
        { title: 'Check the connection', body: 'Back in CAD Automation, CAD Assistant lists the app under Connected assistants.', where: 'Connected assistants' },
        { title: 'Try it', body: 'Ask Claude: "Check the CAD Automation connection to SOLIDWORKS." It says which computer and SOLIDWORKS version it reached.' },
      ],
      after: 'Your first request to build something is best a small part: see /learn/cad-automation/.',
    },
    {
      id: 'connect-other',
      title: 'Connect ChatGPT or another MCP app',
      outcome: 'Your AI app is connected to CAD Automation, by sign-in or, for an app that cannot sign in, by a private address.',
      steps: [
        { title: 'Copy the connector address', body: 'In CAD Automation, open CAD Assistant and copy the Connector address.', where: 'Connector address' },
        {
          title: 'ChatGPT',
          body: 'Where your ChatGPT plan allows custom connectors, add a new connector and paste the address. Your workspace administrator may need to allow custom connectors first. Sign in when asked and choose Allow.',
        },
        {
          title: 'Other apps',
          body: 'Any app that supports remote MCP servers over Streamable HTTP can use the connector address. Add it the way the app describes, sign in and choose Allow.',
        },
        {
          title: 'If the app cannot sign in',
          body: 'Open Settings in CAD Automation. Under Private connector address, choose Show and Copy, and give the app that address. It works without sign-in, so anyone who has it can use your CAD connection: treat it like a password.',
          where: 'Private connector address',
        },
        {
          title: 'Replace a private address that was shared',
          body: 'Choose Make a new private address. The old one stops at once; give the new one to your app.',
          where: 'Make a new private address',
        },
      ],
      after: 'An app connected by sign-in appears under Connected assistants on CAD Assistant. An app using the private address acts as you, without a sign-in of its own.',
    },
    {
      id: 'choose-computer-disconnect',
      title: 'Choose the computer, and disconnect an app',
      outcome: 'Your assistant works on the computer you mean, and apps you no longer use have no access.',
      steps: [
        {
          title: 'Let it choose when it can',
          body: 'When only one of your computers is online, or only one has SOLIDWORKS open, the assistant uses it by itself.',
        },
        {
          title: 'Name the computer',
          body: 'When several are online, name the one you mean in your request, for example "on DESK-02". You can ask the assistant to list your computers first.',
        },
        {
          title: 'Or set a default',
          body: 'In CAD Automation, open SOLIDWORKS and choose Make default next to the computer to use when you do not name one.',
          where: 'Make default',
        },
        {
          title: 'Disconnect an app',
          body: 'Open CAD Assistant. Under Connected assistants, choose Disconnect next to the app and confirm. It loses access to CAD Automation until you connect it again.',
          where: 'Disconnect',
        },
      ],
      after: 'To stop all access to one computer, remove the computer on the SOLIDWORKS page instead (see /learn/cad-automation/).',
    },
  ],
  buttons: [
    { label: 'Copy (Connector address)', does: 'Copies the connector address for your AI app.', when: 'You add CAD Automation to an AI app.' },
    { label: 'Allow', does: 'On the consent page, connects the AI app to your CAD Automation.', after: 'The app appears under Connected assistants and can use the SOLIDWORKS tools as you.' },
    { label: 'Cancel', does: 'On the consent page, refuses the connection.', when: 'You did not start this connection, or the app is not the one you expect.' },
    { label: 'Disconnect', does: 'Removes an AI app\'s access after you confirm.', after: 'It loses access until you connect it again.' },
    { label: 'Show', does: 'Shows the private connector address in Settings.', when: 'An app cannot sign in.' },
    { label: 'Make a new private address', does: 'Replaces your private connector address.', after: 'The old address stops at once.' },
    { label: 'Make default', does: 'Chooses the computer used when several are online and you do not name one.' },
  ],
  faqs: [
    {
      q: 'What can a connected AI app do?',
      a: "Only what CAD Automation's tools do, as you, on your own paired computers: check the connection, create, open, read and save documents, add and change features, assemblies and mates, drawings, measurements, previews, imports and exports, and list or cancel commands. The Tools page lists all of them in plain words. It cannot reach your BIZOMAT ERP records.",
    },
    {
      q: 'What is MCP?',
      a: 'MCP, the Model Context Protocol, lets an AI app call tools in other software. CAD Automation gives the app its SOLIDWORKS tools through one connector address.',
    },
    {
      q: 'Does CAD Automation run AI of its own?',
      a: 'No. Your AI app does the thinking. CAD Automation checks each sketch and feature and runs the work in SOLIDWORKS on your computer.',
    },
    {
      q: 'How long does the connection stay signed in?',
      a: 'The app renews its sign-in by itself. If it is not used for 90 days, it has to sign in again. Each app has one connection per person: connecting it again replaces the old one.',
    },
    {
      q: 'Can the AI change or delete my work without asking?',
      a: 'It can build and change features, but deleting features, undoing, saving over a file, replacing a drawing or removing a variable asks you in SOLIDWORKS first (on by default). Choose Allow once or Deny; no answer within two minutes means no.',
    },
    {
      q: 'The app says several computers are connected.',
      a: 'Name the computer in your request, or set a default computer on the SOLIDWORKS page with Make default.',
    },
    {
      q: 'The app cannot sign in, or the sign-in fails.',
      a: 'Remove the connector in your app and add it again, then sign in and choose Allow. If it still fails, use the private connector address from Settings (see /learn/trouble-connections/).',
    },
    {
      q: 'A long task stopped when the app gave up waiting.',
      a: 'Long commands keep running on your computer. Ask the assistant for the command\'s progress: it can follow it to the end or cancel it. Some apps end a tool call after about a minute, which can stop the self test after its first step.',
    },
    {
      q: 'Which AI apps have been tested?',
      a: "CAD Automation's sign-in is tested with the MCP software development kit's own client, and Claude has been used with it on a real SOLIDWORKS computer. ChatGPT's connector has not been tested yet. Any app that supports remote MCP servers over Streamable HTTP should work.",
    },
  ],
  related: ['cad-automation', 'trouble-connections', 'integrations', 'ai-search'],
  workflows: ['cad-to-product'],
  notYet: [
    { text: 'Inside BIZOMAT ERP, each AI connection working in one company chosen when you approve it. Built, but switched off for customers.', status: 'in-development' },
    { text: 'AI actions on ERP records, each a proposal a person approves.', status: 'planned' },
  ],
  keywords: ['MCP', 'Model Context Protocol', 'connector', 'custom connector', 'Claude', 'ChatGPT', 'OAuth', 'sign in', 'consent', 'private address', 'remote MCP server', 'device', 'computer'],
  sources: [
    'apps/cad/opensketch/app_pages.py',
    'apps/cad/opensketch/mcp_server.py',
    'apps/cad/opensketch/mcpauth.py',
    'apps/cad/opensketch/auth.py',
    'apps/cad/opensketch/catalog.py',
    'apps/cad/opensketch/devicebridge.py',
    'apps/cad/opensketch/site.py',
    'apps/cad/opensketch/static/ui/app.js',
    'apps/cad/CLAUDE.md',
    'docs/cad/README.md',
  ],
  updated: '2026-11-20',
};

export default guide;
