// BIZOMAT platform: where each product application lives, and the facts the website states about them.
//
// The website (bizomat.ai) is public. The two applications sit on their own hosts and need sign-in:
//   CAD Automation      (formerly CADOS)          today https://cados.kevos.com, target https://cad.bizomat.ai
//   Project Management  (formerly KEVOS Work)     today https://work.kevos.com,  target https://work.bizomat.ai
// The old hosts keep working after the move (the platform proxy serves both), so they are the safe defaults until the
// new hosts have valid certificates. Switch with PUBLIC_CAD_APP_URL and PUBLIC_WORK_APP_URL at build time
// (docs/BIZOMAT-DEPLOYMENT.md, "DNS cutover").
const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};
const clean = (value: string | undefined, fallback: string) => (value && /^https:\/\/[a-z0-9.-]+$/i.test(value.trim()) ? value.trim().replace(/\/$/, '') : fallback);

export const PLATFORM = {
  name: 'BIZOMAT',
  tagline: 'Intelligent Business Automation Platform',
  statement: 'Automate work. Connect systems. Get business done.',
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
  cad: clean(env.PUBLIC_CAD_APP_URL, 'https://cados.kevos.com'),
  work: clean(env.PUBLIC_WORK_APP_URL, 'https://work.kevos.com'),
} as const;

/** Links into the applications. Both send a visitor who is not signed in to their sign-in page. */
export const APP_LINKS = {
  cad: { home: `${APP_URLS.cad}/`, signIn: `${APP_URLS.cad}/login`, dashboard: `${APP_URLS.cad}/dashboard`, docs: `${APP_URLS.cad}/docs`, download: `${APP_URLS.cad}/download/solidworks`, mcp: `${APP_URLS.cad}/mcp` },
  work: { home: `${APP_URLS.work}/`, signIn: `${APP_URLS.work}/login`, dashboard: `${APP_URLS.work}/` },
} as const;
