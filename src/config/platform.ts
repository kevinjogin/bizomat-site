// BIZOMAT platform: where each product application lives, and the facts the website states about them.
//
// The production addresses, all on bizomat.ai (docs/BIZOMAT-CLOUDFLARE-MIGRATION.md, "Production addresses"):
//   the website                                   https://bizomat.ai        (www.bizomat.ai answers 301 there)
//   CAD Automation      (formerly CADOS)          https://bizomat.ai/cad    (the Worker passes /cad to bizomat-mcp)
//   its MCP endpoint for AI apps                  https://mcp.bizomat.ai/mcp (the Worker bizomat-mcp itself)
//   Project Management  (formerly KEVOS Work)     https://bizomat.ai/tasks  (the Worker sends /tasks on to the app)
// The applications need sign-in. The old addresses (cados.kevos.com, work.kevos.com) keep working for programs set up
// with them. Override with PUBLIC_CAD_APP_URL, PUBLIC_CAD_MCP_URL and PUBLIC_WORK_APP_URL at build time.
const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};
const clean = (value: string | undefined, fallback: string) => (value && /^https:\/\/[a-z0-9.-]+(\/[a-z0-9-]+)*\/?$/i.test(value.trim()) ? value.trim().replace(/\/$/, '') : fallback);

export const PLATFORM = {
  name: 'BIZOMAT',
  // Corporate brand language (owner, 8 Nov 2026). The descriptor and the slogan replace "Intelligent Business Automation
  // Platform" and "Automate work. Connect systems. Get business done." Products keep their own names and wording.
  /** Brand descriptor. */
  tagline: 'Business Intelligence & Automation',
  /** Primary slogan. */
  statement: 'Connecting Intelligence. Empowering Progress.',
  /** Supporting message. */
  support: 'Technology Connected. Progress Delivered.',
  /** Corporate introduction. */
  introduction: 'BIZOMAT brings together intelligent technologies, connected systems and practical automation to help businesses and industries work smarter, operate better and move forward.',
  /** Corporate description: metadata and structured data. */
  description: 'BIZOMAT is a technology and automation company connecting business intelligence, artificial intelligence, engineering and practical automation.',
  /** The footer's short description. */
  footer: 'BIZOMAT connects intelligent technologies, software and practical automation to simplify work and advance business and industry.',
  founder: 'Kevin Jogin',
  /** The trade mark the business registered under its former name. BIZOMAT itself is not a registered trade mark. */
  formerName: {
    name: 'KEVOS',
    tradeMark: '2469816',
    tradeMarkClass: 42,
    registeredFrom: '29 July 2024',
    enteredOnRegister: '7 March 2025',
    record: 'https://search.ipaustralia.gov.au/trademarks/search/view/2469816',
  },
} as const;

export const APP_URLS = {
  cad: clean(env.PUBLIC_CAD_APP_URL, 'https://bizomat.ai/cad'),
  /** The connector address AI apps add: the MCP server's own host (the Worker bizomat-mcp). */
  cadMcp: clean(env.PUBLIC_CAD_MCP_URL, 'https://mcp.bizomat.ai/mcp'),
  work: clean(env.PUBLIC_WORK_APP_URL, 'https://bizomat.ai/tasks'),
} as const;

/** Links into the applications. Both send a visitor who is not signed in to their sign-in page. */
export const APP_LINKS = {
  cad: { home: `${APP_URLS.cad}/`, signIn: `${APP_URLS.cad}/login`, dashboard: `${APP_URLS.cad}/dashboard`, docs: `${APP_URLS.cad}/docs`, download: `${APP_URLS.cad}/download/solidworks`, mcp: APP_URLS.cadMcp },
  work: { home: `${APP_URLS.work}/`, signIn: `${APP_URLS.work}/login`, dashboard: `${APP_URLS.work}/` },
} as const;
