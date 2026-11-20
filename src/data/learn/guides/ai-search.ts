import type { Guide } from '../types.ts';

const guide: Guide = {
  id: 'ai-search',
  section: 'ai',
  title: 'AI Search and the BIZOMAT Assistant',
  short: 'AI Search',
  status: 'live',
  what: "AI Search is the Ask BIZOMAT box on the BIZOMAT website. You describe in plain words what you want to find or get done, and it lists the BIZOMAT product pages, documentation, Tools and Library chapters that fit, each with a link and the reason it matched.",
  purpose: [
    'Find the right Tool or calculator for a question, without knowing its name.',
    'Find the Library chapters that explain a subject.',
    'Find which BIZOMAT system or product page covers a need.',
    'Get a suggested order of steps: what to read, which tool to use and how to check the result.',
    'Build a learning path from Library chapters, with tools to practise on.',
  ],
  who: [
    'Anyone visiting bizomat.ai, signed in or not.',
    'Engineers and technicians looking for a calculation or a check.',
    'People learning a subject from the Library.',
    'People deciding which BIZOMAT system fits a need.',
  ],
  tutorials: [
    {
      id: 'search-a-question',
      title: 'Find a tool or a reading with AI Search',
      outcome: 'You have a short list of real BIZOMAT pages that fit your question, with a suggested order to use them.',
      steps: [
        {
          title: 'Open AI Search',
          body: 'On any page of bizomat.ai, choose AI Search in the header. It takes you to the Ask BIZOMAT box on the home page.',
          where: 'AI Search',
        },
        {
          title: 'Describe what you need',
          body: 'Type your question in plain words in the box, for example what you want to work out, fix or learn. Leave out personal or confidential details: the box searches public pages only. You can also choose one of the examples under Try, then edit it.',
          where: 'What would you like to find or get done?',
        },
        {
          title: 'Search',
          body: 'Choose Search, or press Enter. The line under the box says what it is doing, for example "Understanding what you need…" and then how many resources it found.',
          where: 'Search',
        },
        {
          title: 'Read Your Solution Path',
          body: 'For a quick question, Your Solution Path shows numbered steps. Each step can show Why it matters, What to read, Which tool to use, the inputs the tool asks for and How to check the result. The line under the title says whether the steps were suggested by BIZOMAT AI or come from the BIZOMAT workflow for this type of question.',
          where: 'Your Solution Path',
        },
        {
          title: 'Look through the matching resources',
          body: 'Under All matching resources, results are grouped as BIZOMAT products and documentation, Recommended tools, Knowledge and references, and Related resources. Each card says why it matched. Choose Open tool → to run a tool, or Read now → to open a chapter or page.',
          where: 'All matching resources',
        },
        {
          title: 'Ask a follow-up',
          body: 'The box stays ready for a follow-up question. If the path lists "To tailor this path, it would help to know:", add those details in your next question.',
        },
      ],
      after: 'Open a tool and enter your own figures. Every number comes from the tool when you run it, never from AI Search.',
    },
    {
      id: 'plan-learning',
      title: 'Plan what to learn',
      outcome: 'You have a learning path of Library chapters in a sensible order, with tools to practise on.',
      steps: [
        {
          title: 'Open a planner box',
          body: 'Use the Ask BIZOMAT box on the home page, the box "Not sure which tool you need?" at the top of Tools, or the box "Plan what to read" at the top of the Library. They use the same search.',
        },
        {
          title: 'Say what you want to learn',
          body: 'Describe your goal, for example "I want to learn mechanical design, from the basics to bearings, shafts and fasteners." Keep it under 1,000 characters.',
        },
        {
          title: 'Answer the one question, if asked',
          body: 'When your request could mean clearly different things, BIZOMAT asks one short question with a few options. Choose an option, or choose Build it anyway → to go on without one.',
          where: 'Build it anyway →',
        },
        {
          title: 'Open your learning path',
          body: 'Your learning path shows the course contents: modules and lessons built from Library chapters, with tools to practise on. The label says whether it was arranged from the Library (no AI) or planned by BIZOMAT AI from the Library and Tools.',
          where: 'Your learning path',
        },
        {
          title: 'Work through the lessons',
          body: 'Choose Start the course →, read each lesson, use Read the chapter → and Open the tool →, then choose Mark lesson complete and Next lesson →.',
          where: 'Start the course →',
        },
      ],
      after: 'If BIZOMAT could not find Library material for your subject, it shows matching resources instead.',
    },
  ],
  buttons: [
    { label: 'AI Search', does: 'Opens the Ask BIZOMAT box on the home page from any page of the website.', when: 'You want to search in plain words.' },
    { label: 'Search', does: 'Runs your question against the public catalogue.', after: 'Your Solution Path or your learning path appears below the box, with the matching resources.' },
    { label: 'Try (examples)', does: 'Fills the box with an example question.', when: 'You are not sure how to phrase your question.', after: 'You can edit the example before searching.' },
    { label: 'Open tool →', does: 'Opens the matching tool in Tools.', after: 'Enter your own values: the tool calculates and shows its method.' },
    { label: 'Read now →', does: 'Opens the matching Library chapter, book or BIZOMAT page.' },
    { label: 'Build it anyway →', does: 'Builds the path without answering the clarifying question.', when: 'None of the options fits.' },
    { label: 'Start the course →', does: 'Opens the first lesson of your learning path.' },
    { label: 'Mark lesson complete', does: 'Marks the open lesson as done in your learning path.', after: 'Course progress moves on.' },
    { label: 'Suggest a new tool or topic →', does: 'Opens the contact page so you can suggest something BIZOMAT does not cover yet.', when: 'No resource fits your question.' },
  ],
  faqs: [
    {
      q: 'Does AI Search see my projects, records or files?',
      a: "No. It searches only the public catalogue built into the website: BIZOMAT product and documentation pages, Tools, and Library books and chapters. It never reads anything in BIZOMAT ERP, the CRM, Finance or CAD Automation. Leave personal and confidential details out of your question.",
    },
    {
      q: 'Is an AI model used to answer?',
      a: "It depends on whether the website's AI step is switched on. When it is, your question (and your previous question, for a follow-up) and a shortlist of matching catalogue entries are sent to a Cloudflare Workers AI model. For a quick search, the model only returns search terms, picks entries from the shortlist by their number and suggests steps; anything else in its reply is dropped, so it cannot add pages, links or results. In a learning path it can also plan the lessons and write explanations, which are labelled BIZOMAT AI and based on the Library readings shown with them. When the AI step is not available, the search runs on keywords in your browser and the steps come from BIZOMAT's workflow for that type of question. At the time of writing (20 November 2026) bizomat.ai answers without the AI step. The line under Your Solution Path always says which one you are seeing.",
    },
    {
      q: 'Can AI Search calculate an answer for me?',
      a: 'No. It points you to the tool that calculates. Steps that state a result are removed before they reach you. Every number comes from a tool when you run it with your own values.',
    },
    {
      q: 'Why does it say "That looks outside what BIZOMAT covers"?',
      a: 'Your question is about a subject BIZOMAT has no tools or books for, such as weather or sport. It shows the closest resources it has, if any. You can suggest a new tool or topic from the results.',
    },
    {
      q: 'How long can my question be?',
      a: 'Keep it under 1,000 characters. A quick search uses the first 500 characters. Short, specific questions give the best results.',
    },
    {
      q: 'It says "Too many requests. Please wait a minute and try again." Why?',
      a: 'The website limits how many searches one connection can make in a minute, so the service stays available for everyone. Wait a minute and search again.',
    },
    {
      q: 'Is anything about my search kept?',
      a: 'BIZOMAT may record anonymous statistics about searches: the type of event (search, click, no result or clarifying question), up to eight search words and whether it was a phone or a computer. Your IP address, account and full question are not stored with them.',
    },
    {
      q: 'Where is the BIZOMAT Assistant chat window?',
      a: 'The floating Ask BIZOMAT chat was switched off on 1 November 2026, when the AI Search box replaced it. Its code is still on the website and answers only from published website content, but it is not switched on: if you reach it, it says "The assistant is not switched on yet." To ask the team a question, use the contact page.',
    },
    {
      q: 'Can an AI assistant work with my ERP records?',
      a: 'Not yet. An assistant over ERP records is planned. Today, AI apps such as Claude or ChatGPT can work in SOLIDWORKS through CAD Automation (see /learn/cad-ai-connection/).',
    },
  ],
  related: ['what-is-bizomat', 'cad-ai-connection', 'integrations', 'automations'],
  notYet: [
    { text: 'The BIZOMAT Assistant chat window on the website: built, but switched off since 1 November 2026, when AI Search replaced it.', status: 'in-development' },
    { text: 'An AI assistant that works with your ERP records, where every action is a proposal a person approves.', status: 'planned' },
  ],
  keywords: ['Ask BIZOMAT', 'search', 'AI', 'chatbot', 'chat', 'assistant', 'find a tool', 'calculator', 'Solution Path', 'learning path', 'course', 'Library', 'Tools', 'discovery'],
  sources: [
    'src/pages/index.astro',
    'src/components/discovery/DiscoveryBox.astro',
    'src/components/discovery/LearningPlanner.astro',
    'src/scripts/discovery.ts',
    'src/scripts/learning-ui.ts',
    'src/lib/learning/course.ts',
    'src/utils/discovery-index.ts',
    'src/server/discover/handler.ts',
    'src/server/learn/handler.ts',
    'src/server/ai/provider.ts',
    'src/server/chat/handler.ts',
    'src/components/ChatWidget.astro',
    'src/pages/chat.astro',
    'src/pages/assistant-knowledge.json.ts',
    'src/config/site.ts',
    'src/worker.ts',
    'src/node/server.ts',
    'src/node/bindings.ts',
    'src/data/erp-capabilities.ts',
  ],
  updated: '2026-11-20',
};

export default guide;
