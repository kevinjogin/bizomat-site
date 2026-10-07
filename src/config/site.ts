// Site-wide settings. Change branding, navigation and contact details here.

export const SITE = {
  name: 'KEVOS',
  url: 'https://gocore.com.au',
  locale: 'en-AU',
  ogLocale: 'en_AU',
  country: 'Australia',
  /** Default <title> on the homepage and fallback description everywhere else. */
  title: 'KEVOS | Engineering, Manufacturing & Operations Support',
  description:
    'KEVOS provides practical CAD, manufacturing, process improvement and engineering project support for businesses in Sydney and across Australia.',
  /** One-line brand statement used in the footer and structured data. */
  statement: 'Practical engineering, manufacturing, operations and project support for businesses that need work moved forward.',
  /** Short descriptor shown under the brand in places like the footer. */
  tagline: 'Smarter ways to fix, make & move.',
  /** Public contact email. Leave empty to hide it everywhere until it is set up. */
  email: '',
  /** Optional profiles, e.g. { label: 'LinkedIn', href: 'https://www.linkedin.com/company/…' }. */
  social: [] as Array<{ label: string; href: string }>,
  /** Default social sharing image in /public (1200 × 630). */
  ogImage: '/brand/kevos-logo-safe-v2.png',
  /**
   * Brand assets supplied for KEVOS. The main wordmark is navy on light backgrounds and is rendered white in dark mode.
   */
  logo: {
    svg: '/brand/kevos-logo-safe-v2.png',
    png: '/brand/kevos-logo-safe-v2.png',
    webp: '/brand/kevos-logo-safe-v2.png',
    width: 304,
    height: 38,
  },
  icon: '/brand/kevos-favicon-v2.png',
  iconLarge: '/brand/kevos-favicon-v2.png',
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
  /** Online meeting booking (Google Calendar appointment schedule). Opens in a new tab; nothing is embedded. */
  booking: {
    url: 'https://calendar.app.google/SY5FtkX97haPCEh39',
    label: 'Book a meeting',
  },
  /** AI assistant (Cloudflare Workers AI). Set to false to remove the chat widget everywhere. */
  assistant: {
    enabled: true,
    name: 'KEVOS Assistant',
    endpoint: '/api/chat',
  },
  /** Jurisdiction stated in the Terms page. Confirm before launch. */
  jurisdiction: 'New South Wales, Australia',
} as const;

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/services/', label: 'Services' },
  { href: '/tools/', label: 'Tools' },
  { href: '/how-it-works/', label: 'How It Works' },
  { href: '/industries/', label: 'Industries' },
  { href: '/insights/', label: 'Insights' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
] as const;

/** Primary call to action in the header and across the site. */
export const QUOTE_CTA = { href: '/contact/', label: 'Get a Quote' } as const;

export const FOOTER_NAV = {
  services: [
    { href: '/services/#engineering-cad', label: 'Engineering & CAD' },
    { href: '/services/#manufacturing', label: 'Manufacturing Support' },
    { href: '/services/#operations', label: 'Operations Improvement' },
    { href: '/services/#project-support', label: 'Project Support' },
    { href: '/factory-fix/', label: 'Factory Fix' },
  ],
  company: [
    { href: '/tools/', label: 'Free Tools' },
    { href: '/how-it-works/', label: 'How It Works' },
    { href: '/industries/', label: 'Industries' },
    { href: '/about/', label: 'About' },
    { href: '/insights/', label: 'Insights' },
    { href: '/work/', label: 'Initiatives' },
  ],
  legal: [
    { href: '/privacy/', label: 'Privacy' },
    { href: '/terms/', label: 'Terms' },
    { href: '/disclaimer/', label: 'Disclaimer' },
  ],
} as const;

/** Insights listing settings. */
export const INSIGHTS = {
  pageSize: 12,
  /** A category page is generated once it has at least this many published articles. */
  minPostsForCategoryPage: 1,
  /** A tag page is generated once it has at least this many published articles. */
  minPostsForTagPage: 2,
  /** Show a table of contents when an article has at least this many H2 sections. */
  minHeadingsForToc: 4,
  wordsPerMinute: 220,
} as const;
