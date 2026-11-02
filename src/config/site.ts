// Site-wide settings. Change branding, navigation and contact details here.

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
  title: 'KEVOS® | Engineering Tools, Technical Knowledge & Technology',
  description:
    'KEVOS® provides practical CAD, manufacturing, process improvement and engineering project support for businesses in Sydney and across Australia.',
  /** One-line brand statement used in the footer and structured data. */
  statement: 'Practical tools and technical knowledge for people who design, build, operate and improve things.',
  /** Short descriptor shown under the brand in places like the footer. */
  tagline: 'Practical help to design, make and improve.',
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
    starters: ['Help me explore KEVOS®', 'I have a question about WORKOS', 'I have a question about READOS', 'I have an idea or suggestion', 'I want to discuss a collaboration'],
  },
  /** Jurisdiction stated in the Terms page. Confirm before launch. */
  jurisdiction: 'New South Wales, Australia',
} as const;

/** Main navigation (header on every screen size). The labels are plain words; WORKOS, READOS and REACHOS stay as the
 *  names of the platforms on their own pages. */
export const NAV = [
  { href: '/tools/', label: 'Tools' },
  { href: '/reados/', label: 'Library' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
] as const;
/** Breadcrumb labels for the two libraries, matching NAV. */
export const CRUMB = { tools: 'Tools', library: 'Library' } as const;


/** Primary call to action in the header and across the site. */
export const QUOTE_CTA = { href: '/contact/', label: 'Contact' } as const;

export const FOOTER_NAV = {
  services: [
    { href: '/services/#engineering-cad', label: 'Engineering and CAD' },
    { href: '/services/#manufacturing', label: 'Manufacturing Support' },
    { href: '/services/#operations', label: 'Operations Improvement' },
    { href: '/services/#project-support', label: 'Project Support' },
    { href: '/assessment/', label: 'Problem Assessment' },
    { href: '/factory-fix/', label: 'Factory Fix' },
  ],
  company: [
    { href: '/', label: 'KEVOS®' },
    { href: '/tools/', label: 'Tools' },
    { href: '/reados/', label: 'Library' },
    { href: '/about/', label: 'About' },
    { href: '/about/#work', label: 'Proof of Work' },
    { href: '/services/', label: 'Services' },
    { href: '/how-it-works/', label: 'How It Works' },
    { href: '/industries/', label: 'Industries' },
    { href: '/contact/', label: 'Contact' },
  ],
  legal: [
    { href: '/privacy/', label: 'Privacy' },
    { href: '/terms/', label: 'Terms' },
    { href: '/disclaimer/', label: 'Disclaimer' },
  ],
} as const;

/** Reading-time estimate for READOS chapters. */
export const READING = {
  wordsPerMinute: 220,
} as const;
