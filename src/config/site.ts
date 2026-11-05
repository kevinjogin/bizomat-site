// Site-wide settings. Change branding, navigation and contact details here.
import { PRODUCTS, SOLUTIONS } from './products.ts';

export const SITE = {
  name: 'KEVOS®',
  tradeMark: {
    number: '2469816',
    class: 42,
    registeredFrom: '29 July 2024',
    enteredOnRegister: '7 March 2025',
    record: 'https://search.ipaustralia.gov.au/trademarks/search/view/2469816',
  },
  url: 'https://kevos.com',
  locale: 'en-AU',
  ogLocale: 'en_AU',
  country: 'Australia',
  /** Default <title> on the homepage and fallback description everywhere else. */
  title: 'KEVOS® | Make Difficult Work Simple',
  description:
    'KEVOS® builds practical software, tools and knowledge that make difficult work simple: Work, CADOS, browser-based engineering and business tools and a technical Library.',
  /** One-line brand statement used in the footer and structured data. */
  statement: 'Practical software, tools and knowledge that make difficult work simple.',
  /** Short descriptor shown under the brand in places like the footer. */
  tagline: 'Make difficult work simple.',
  /** Public contact email. Leave empty to hide it everywhere until it is set up. */
  email: '',
  /** Optional profiles, e.g. { label: 'LinkedIn', href: 'https://www.linkedin.com/company/…' }. */
  social: [] as Array<{ label: string; href: string }>,
  /** Default social sharing image in /public (1200 × 630). */
  ogImage: '/brand/kevos-social-orange.png',
  /**
   * Orange KEVOS® wordmark, retaining the approved angular letterforms.
   * The header, footer and Engineering Core also use a matching brighter dark-theme SVG.
   */
  logo: {
    svg: '/brand/kevos-wordmark-orange-light.svg',
    png: '/brand/kevos-wordmark-orange-light.png',
    webp: '/brand/kevos-wordmark-orange-light.webp',
    width: 1280,
    height: 176,
  },
  icon: '/brand/kevos-favicon-k-orange-192.png',
  iconLarge: '/brand/kevos-favicon-k-orange-512.png',
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
    name: 'KEVOS® Assistant',
    endpoint: '/api/chat',
    /** Conversation starters in the assistant and on the REACHOS page. */
    starters: ['Help me explore KEVOS®', 'I have a question about Tools', 'I have a question about Library', 'I have an idea or suggestion', 'I want to discuss a collaboration'],
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
export type NavItem = { label: string; href: string; children?: readonly NavChild[] };

export const NAV: readonly NavItem[] = [
  {
    label: 'Products', href: '/products/', children: [
      ...PRODUCTS.map((p) => ({ label: p.name, href: p.url, description: p.tagline, status: p.status === 'soon' ? 'Coming soon' : undefined, external: Boolean(p.url) })),
      { label: 'All products', href: '/products/' },
    ],
  },
  {
    label: 'Solutions', href: '/solutions/', children: [
      ...SOLUTIONS.map((s) => ({ label: s.name, href: `/solutions/#${s.id}`, description: s.short })),
      { label: 'All solutions', href: '/solutions/' },
    ],
  },
  { label: 'Tools', href: '/tools/' },
  {
    label: 'Resources', href: '/resources/', children: [
      { label: 'Library', href: '/reados/', description: 'Technical books in short, practical chapters.' },
      { label: 'Guides and articles', href: '/library/', description: 'Longer guides with worked examples.' },
      { label: 'All resources', href: '/resources/' },
    ],
  },
  {
    label: 'About', href: '/about/', children: [
      { label: 'Company', href: '/about/', description: 'Who KEVOS® is and how it works.' },
      { label: 'Contact', href: '/contact/', description: 'Ask a question or start a conversation.' },
    ],
  },
] as const;
/** Breadcrumb labels for the two libraries. */
export const CRUMB = { tools: 'Tools', library: 'Library' } as const;

/** The one action in the header: the "Ask KEVOS" box at the top of the homepage. */
export const GET_STARTED = { href: '/#ask', label: 'Get Started' } as const;

/** Contact call to action used in the footer and on service pages. */
export const QUOTE_CTA = { href: '/contact/', label: 'Contact' } as const;

export const FOOTER_NAV = {
  products: [
    ...PRODUCTS.filter((p) => p.url).map((p) => ({ href: p.url as string, label: p.name })),
    { href: '/products/', label: 'All products' },
  ],
  solutions: [
    ...SOLUTIONS.map((s) => ({ href: `/solutions/#${s.id}`, label: s.name })),
    { href: '/solutions/', label: 'All solutions' },
  ],
  resources: [
    { href: '/tools/', label: 'Tools' },
    { href: '/reados/', label: 'Library' },
    { href: '/library/', label: 'Guides and articles' },
    { href: '/search/', label: 'Search' },
    { href: '/rss.xml', label: 'Library RSS feed' },
  ],
  company: [
    { href: '/about/', label: 'About' },
    { href: '/contact/', label: 'Contact' },
    { href: '/services/', label: 'Engineering services' },
    { href: '/assessment/', label: 'Problem Assessment' },
    { href: '/factory-fix/', label: 'Factory Fix' },
    { href: '/about/#work', label: 'Proof of Work' },
    { href: '/how-it-works/', label: 'How It Works' },
    { href: '/industries/', label: 'Industries' },
  ],
  legal: [
    { href: '/privacy/', label: 'Privacy' },
    { href: '/terms/', label: 'Terms' },
    { href: '/disclaimer/', label: 'Disclaimer' },
  ],
} as const;

/** Reading-time estimate for Library chapters. */
export const READING = {
  wordsPerMinute: 220,
} as const;
