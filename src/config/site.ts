// Site-wide settings. Change branding, navigation and contact details here.
import { PRODUCTS, SOLUTIONS } from './products.ts';
import { APP_LINKS, PLATFORM } from './platform.ts';
import { SYSTEMS, SYSTEMS_HOME } from './systems.ts';

const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};
const siteUrl = /^https:\/\/[a-z0-9.-]+$/i.test(env.PUBLIC_SITE_URL ?? '') ? (env.PUBLIC_SITE_URL as string) : 'https://bizomat.ai';

export const SITE = {
  name: 'BIZOMAT',
  /** The business's former name. KEVOS® is a registered Australian trade mark; BIZOMAT is not registered. */
  formerName: PLATFORM.formerName,
  /** Canonical address. bizomat.ai by default; set PUBLIC_SITE_URL at build time while another host serves the site. */
  url: siteUrl,
  locale: 'en-AU',
  ogLocale: 'en_AU',
  country: 'Australia',
  /** Default <title> on the homepage and fallback description everywhere else. */
  title: 'BIZOMAT | Business Intelligence & Automation',
  description: PLATFORM.description,
  /** One-line brand statement used in the footer and structured data. */
  statement: PLATFORM.statement,
  /** Short descriptor shown under the brand in places like the footer. */
  tagline: PLATFORM.tagline,
  /** Supporting message, corporate introduction and the footer's short description (src/config/platform.ts). */
  support: PLATFORM.support,
  introduction: PLATFORM.introduction,
  footer: PLATFORM.footer,
  /** Public contact email (owner, 6 Nov 2026). Leave empty to hide it everywhere. Must equal CONTACT_EMAIL in
   *  src/server/contact/cloudflare-mail.ts (a test checks). */
  email: 'info@bizomat.ai',
  /** Optional profiles, e.g. { label: 'LinkedIn', href: 'https://www.linkedin.com/company/…' }. */
  social: [] as Array<{ label: string; href: string }>,
  /** Default social sharing image in /public (1200 × 630). */
  ogImage: '/brand/bizomat-social.png',
  /** The BIZOMAT wordmark (shared/brand): navy with the teal connector on light, white on dark. */
  logo: {
    svg: '/brand/bizomat-logo-light.svg',
    width: 2329,
    height: 241,
  },
  icon: '/brand/bizomat-icon-192.png',
  iconLarge: '/brand/bizomat-icon-512.png',
  /**
   * Contact form delivery. The UI is identical for both providers.
   *  - 'web3forms': the browser posts straight to Web3Forms (works on day one, no server needed).
   *  - 'worker':    posts to /api/contact, handled by the site's Cloudflare worker (src/worker.ts),
   *                 which sends mail through the provider configured in Cloudflare.
   */
  contact: {
    provider: (import.meta.env?.PUBLIC_CONTACT_PROVIDER || 'web3forms') as 'web3forms' | 'worker',
    /** Web3Forms access key. This is a public form identifier (safe in page HTML), not a password. */
    web3formsAccessKey: import.meta.env?.PUBLIC_WEB3FORMS_ACCESS_KEY || 'c5ca4d90-6501-4069-95b8-d53d2c49d67a',
    web3formsEndpoint: 'https://api.web3forms.com/submit',
    workerEndpoint: import.meta.env?.PUBLIC_CONTACT_ENDPOINT || '/api/contact',
  },
  /** Online meeting booking (Proton Calendar booking page). Opens in a new tab; nothing is embedded. */
  booking: {
    url: 'https://calendar.proton.me/bookings#FcYGYbnLv8TCNp3-nXj2rf9WtxOSYPR6WjrYpmZPKzw=',
    label: 'Book a meeting',
  },
  /** AI assistant (Cloudflare Workers AI). Set to false to remove the chat widget everywhere. */
  assistant: {
    // Off since 1 Nov 2026: the homepage question box (discovery) replaced the floating chat.
    enabled: false,
    name: 'BIZOMAT Assistant',
    endpoint: '/api/chat',
    /** Conversation starters in the assistant and on the REACHOS page. */
    starters: ['Help me explore BIZOMAT', 'I have a question about Tools', 'I have a question about Library', 'I have an idea or suggestion', 'I want to discuss a collaboration'],
  },
  /** Jurisdiction stated in the Terms page. Confirm before launch. */
  jurisdiction: 'New South Wales, Australia',
} as const;

/**
 * Main navigation (one list for every screen size; Header.astro). Top-level items are kept to five, with short menus
 * for Products, Solutions, Resources and About. Product links come from src/config/products.ts so the header, footer,
 * homepage and /products/ never disagree. The names WORKOS and READOS stay retired from visible text (2 Nov 2026):
 * the directory is "Tools" and the books are "Library"; URLs /tools/ and /reados/ are unchanged.
 */
export type NavChild = { label: string; href?: string; description?: string; status?: string; external?: boolean };
/** `short`: a short form shown only where the full label does not fit in the header row (the full label stays its
 * accessible name and tooltip). */
export type NavItem = { label: string; short?: string; href: string; children?: readonly NavChild[] };

export const NAV: readonly NavItem[] = [
  // Home | Systems | Resources | About | Contact (owner, 14 Nov 2026). Systems is BIZOMAT's business software, as one
  // catalogue (src/config/systems.ts); the applications open inside BIZOMAT ERP. Resources stay free and public.
  { label: 'Home', href: '/' },
  {
    label: 'Systems', href: SYSTEMS_HOME, children: [
      { label: 'All systems', href: SYSTEMS_HOME, description: 'One connected platform to manage your business.' },
      ...SYSTEMS.map((s) => ({ label: s.name, href: s.url, description: s.status === 'planned' ? `${s.kind}. Planned.` : s.line, status: s.status === 'planned' ? 'Planned' : undefined })),
      { label: 'Open BIZOMAT ERP', href: APP_LINKS.erp.home, description: 'Sign in to your company\'s workspace.', external: true },
    ],
  },
  {
    label: 'Resources', href: '/resources/', children: [
      { label: 'Tools', href: '/tools/', description: 'Engineering, manufacturing and business calculators.' },
      { label: 'Library', href: '/reados/', description: 'Technical books in short, practical chapters.' },
      { label: 'Guides and articles', href: '/library/', description: 'Longer guides with worked examples.' },
      { label: 'Learning paths', href: '/resources/#pathways', description: 'A structured route through a subject.' },
      { label: 'All resources', href: '/resources/', description: 'Free for everyone, no sign-in.' },
    ],
  },
  {
    label: 'About', href: '/engine-room/', children: [
      { label: 'The Engine Room', href: '/engine-room/', description: 'Who builds BIZOMAT, and the proof that it works.' },
      { label: 'From the founder', href: '/engine-room/#founder', description: 'Why BIZOMAT exists, in its founder\'s words.' },
      { label: 'Test record', href: '/engine-room/#tests', description: 'Every suite that was run, with its result.' },
    ],
  },
  { label: 'Contact', href: '/contact/' },
] as const;

/** The header's sign-in menu: BIZOMAT ERP is the one sign-in for the CRM, Finance, Projects and company accounts.
 * Engineering Automation (CAD Automation) keeps its own sign-in for now. */
export const SIGN_IN = [
  { label: 'BIZOMAT ERP', href: APP_LINKS.erp.signIn, description: 'One sign-in for the CRM, Finance, Projects and your company.' },
  { label: 'Engineering Automation', href: APP_LINKS.cad.signIn, description: 'CAD Automation: your AI assistant and SOLIDWORKS. Its own sign-in for now.' },
] as const;
/** Breadcrumb labels for the two libraries. */
export const CRUMB = { tools: 'Tools', library: 'Library' } as const;

/** AI Search: the homepage search box (also reachable from the header on every page). */
export const AI_SEARCH = { href: '/#ai-search', label: 'AI Search' } as const;
/** Kept for pages that still offer a single start action. */
export const GET_STARTED = { href: '/#ai-search', label: 'Get Started' } as const;

/** Contact call to action used in the footer and on service pages. */
export const QUOTE_CTA = { href: '/contact/', label: 'Contact' } as const;

export const FOOTER_NAV = {
  products: [
    { href: SYSTEMS_HOME, label: 'All systems' },
    ...SYSTEMS.map((x) => ({ href: x.url, label: x.name })),
    { href: '/resources/', label: 'Resources (free)' },
    { href: '/solutions/', label: 'Solutions' },
  ],
  resources: [
    { href: '/tools/', label: 'Tools' },
    { href: '/reados/', label: 'Library' },
    { href: '/library/', label: 'Guides and articles' },
    { href: '/search/', label: 'Search' },
    { href: '/rss.xml', label: 'Library RSS feed' },
  ],
  company: [
    { href: '/', label: 'Home' },
    { href: '/engine-room/', label: 'About' },
    { href: '/contact/', label: 'Contact' },
    { href: '/services/', label: 'Engineering services' },
    { href: '/assessment/', label: 'Problem Assessment' },
    { href: '/how-it-works/', label: 'How It Works' },
  ],
  apps: [
    { href: APP_LINKS.erp.signIn, label: 'Sign in to BIZOMAT ERP' },
    { href: APP_LINKS.cad.signIn, label: 'Sign in to Engineering Automation' },
  ],
  legal: [
    { href: '/privacy/', label: 'Privacy Policy' },
    { href: '/terms/', label: 'Terms of Use' },
    { href: '/disclaimer/', label: 'Disclaimer' },
  ],
} as const;

/** Reading-time estimate for Library chapters. */
export const READING = {
  wordsPerMinute: 220,
} as const;
