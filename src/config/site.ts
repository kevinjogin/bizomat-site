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
 * Main navigation (one list for every screen size; Header.astro): Home, Systems, Resources, About and Contact, with
 * short menus. System links come from src/config/systems.ts so the header, footer, homepage and /systems/ never
 * disagree. The names WORKOS and READOS stay retired from visible text (2 Nov 2026):
 * the directory is "Tools" and the books are "Library"; URLs /tools/ and /reados/ are unchanged.
 */
export type NavChild = { label: string; href?: string; description?: string; status?: string; external?: boolean };
/** A group of links inside a menu, under a small heading (the Systems menu holds Systems and Learn). */
export type NavGroup = { label: string; children: readonly NavChild[] };
/** `short`: a short form shown only where the full label does not fit in the header row (the full label stays its
 * accessible name and tooltip). A menu has either `children` (one list) or `groups` (lists side by side), and may end
 * with one `action` across its foot. */
export type NavItem = { label: string; short?: string; href: string; children?: readonly NavChild[]; groups?: readonly NavGroup[]; action?: NavChild };

/** Every link of a menu: its list, its groups' lists and its action (the header marks the menu current from these). */
export const menuLinks = (item: NavItem): readonly NavChild[] =>
  [...(item.children ?? []), ...(item.groups ?? []).flatMap((g) => g.children), ...(item.action ? [item.action] : [])];

/** Learn: the ERP Knowledge Centre, one page at /learn/ (src/data/learn/), and a section of each part of it. A group of
 * the Systems menu (owner, 20 Nov 2026: Systems one menu item, Learn under it), also listed on /systems/. Each anchor
 * is a section of /learn/ (SECTIONS in src/data/learn/types.ts; tests/navigation.test.ts checks them). */
export const LEARN_LINKS: readonly NavChild[] = [
  { label: 'Knowledge Centre', href: '/learn/', description: 'Every guide and tutorial, on one page.' },
  { label: 'Getting started', href: '/learn/#getting-started', description: 'Your account and finding your way.' },
  { label: 'ERP modules', href: '/learn/#modules', description: 'Every module, step by step.' },
  { label: 'Workflows', href: '/learn/#workflows', description: 'Processes across modules, end to end.' },
  { label: 'AI and integrations', href: '/learn/#ai', description: 'AI Search, automations and the API.' },
  { label: 'CAD and engineering', href: '/learn/#cad', description: 'Your AI assistant in SOLIDWORKS.' },
  { label: 'Administrator guide', href: '/learn/#admin', description: 'People, roles, security and settings.' },
  { label: 'Troubleshooting', href: '/learn/#troubleshooting', description: 'Sign-in, access and connections.' },
];

export const NAV: readonly NavItem[] = [
  // Home | Systems | Resources | About | Contact (owner, 14 Nov 2026; 20 Nov 2026: "SYSTEMS as a single menu item, with
  // LEARN as a submenu under SYSTEMS"). Systems is BIZOMAT's business software on one page (src/config/systems.ts), and
  // its menu holds two groups: the systems, and Learn (the Knowledge Centre, one page). The applications open inside
  // BIZOMAT ERP. Resources stay free and public.
  { label: 'Home', href: '/' },
  {
    label: 'Systems', href: SYSTEMS_HOME,
    groups: [
      {
        label: 'Systems', children: [
          { label: 'All systems', href: SYSTEMS_HOME, description: 'Every system, on one page.' },
          ...SYSTEMS.map((s) => ({ label: s.name, href: s.url, description: s.kind, status: s.status === 'planned' ? 'Planned' : undefined })),
        ],
      },
      { label: 'Learn', children: LEARN_LINKS },
    ],
    action: { label: 'Open BIZOMAT ERP', href: APP_LINKS.erp.home, description: 'Sign in to your company\'s workspace.', external: true },
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

/** The header's Sign in (owner, 20 Nov 2026: "as now everything is set under one sign in, remove double account sign in"):
 * one BIZOMAT account and one sign-in, at BIZOMAT ERP, where every system opens. CAD Automation is under Products and
 * Engineering there, and its own page takes the same account (Continue with BIZOMAT). */
export const SIGN_IN = { label: 'Sign in', href: APP_LINKS.erp.signIn } as const;
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
    { href: '/learn/', label: 'Knowledge Centre' },
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
