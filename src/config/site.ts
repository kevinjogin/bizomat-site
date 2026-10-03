// Site-wide settings. Change branding, navigation and contact details here.

export const SITE = {
  name: 'GoCore',
  url: 'https://gocore.com.au',
  locale: 'en-AU',
  ogLocale: 'en_AU',
  country: 'Australia',
  /** Default <title> on the homepage and fallback description everywhere else. */
  title: 'GoCore | Building useful things around real problems',
  description:
    'GoCore is a new Australian business exploring products, technology and practical systems, starting with real problems and building carefully.',
  /** One-line brand statement used in the footer. */
  statement: 'A new Australian business building useful things around real problems.',
  /** Public contact email. Leave empty to hide it everywhere until it is set up. */
  email: '',
  /** Optional profiles, e.g. { label: 'LinkedIn', href: 'https://www.linkedin.com/company/…' }. */
  social: [] as Array<{ label: string; href: string }>,
  /** Default social sharing image in /public (1200 × 630). */
  ogImage: '/og-default.png',
  /**
   * Brand assets, generated from brand-source/ by `node scripts/prepare-brand.mjs`.
   * The wordmark works on both light and dark backgrounds.
   */
  logo: {
    png: '/brand/gocore-logo.png',
    webp: '/brand/gocore-logo.webp',
    width: 607,
    height: 120,
  },
  icon: '/brand/gocore-icon-96.png',
  iconLarge: '/brand/gocore-icon-512.png',
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
  /** AI assistant (Cloudflare Workers AI). Set to false to remove the chat widget everywhere. */
  assistant: {
    enabled: true,
    name: 'GoCore Assistant',
    endpoint: '/api/chat',
  },
  /** Jurisdiction stated in the Terms page. Confirm before launch. */
  jurisdiction: 'New South Wales, Australia',
} as const;

export const NAV = [
  { href: '/about/', label: 'About' },
  { href: '/work/', label: 'Work' },
  { href: '/insights/', label: 'Insights' },
  { href: '/contact/', label: 'Contact' },
] as const;

export const FOOTER_NAV = [
  ...NAV,
  { href: '/privacy/', label: 'Privacy' },
  { href: '/terms/', label: 'Terms' },
] as const;

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
