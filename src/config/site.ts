// Site-wide settings. Change branding, navigation and contact details here.
import { APP_LINKS, PLATFORM } from './platform.ts';

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
  /** Jurisdiction stated in the Terms page. Confirm before launch. */
  jurisdiction: 'New South Wales, Australia',
} as const;

/**
 * Main navigation (one list for every screen size; Header.astro): the four sections of the site. The homepage is the
 * wordmark. "Project Management" is the product the /work/ page presents (the product names stay as they are).
 */
export type NavItem = { label: string; href: string };

export const NAV: readonly NavItem[] = [
  { label: 'CAD Automation', href: '/cad-automation/' },
  { label: 'Project Management', href: '/work/' },
  { label: 'Engine Room', href: '/engine-room/' },
] as const;

/** The header's sign-in menu: each application has its own sign-in; both send you to your dashboard afterwards. */
export const SIGN_IN = [
  { label: 'Project Management', href: APP_LINKS.work.signIn, description: 'Projects, tasks and your team workspace.' },
  { label: 'CAD Automation', href: APP_LINKS.cad.signIn, description: 'Your AI assistant, computers and SOLIDWORKS.' },
] as const;
/** Contact call to action used in the footer and on the product pages. */
export const QUOTE_CTA = { href: '/contact/', label: 'Contact' } as const;

export const FOOTER_NAV = {
  sections: [
    { href: '/', label: 'Home' },
    { href: '/cad-automation/', label: 'CAD Automation' },
    { href: '/work/', label: 'Project Management' },
    { href: '/engine-room/', label: 'About' },
    { href: '/contact/', label: 'Contact' },
  ],
  apps: [
    { href: APP_LINKS.work.signIn, label: 'Sign in to Project Management' },
    { href: APP_LINKS.cad.signIn, label: 'Sign in to CAD Automation' },
  ],
  legal: [
    { href: '/privacy/', label: 'Privacy Policy' },
    { href: '/terms/', label: 'Terms of Use' },
    { href: '/disclaimer/', label: 'Disclaimer' },
  ],
} as const;
