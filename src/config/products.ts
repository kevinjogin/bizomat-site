// KEVOS® products and solution areas: one source for the header, footer, homepage, /products/ and /solutions/.
//
// Rules (owner brief, 5 Nov 2026):
//  - Describe only what the owner has stated about each product. Do not add features, numbers or customers here.
//  - A product with status 'soon' has no URL and is never shown as a link or as available.
//  - Links in solutions point only at pages that exist on kevos.com or at a product's own address.

export type ProductStatus = 'available' | 'soon';

export interface Product {
  id: string;
  /** Short product name as used in navigation ("Work"); `fullName` is the parent-brand form. */
  name: string;
  fullName: string;
  /** One line, used in menus and cards. */
  tagline: string;
  /** Two or three plain sentences for the product card and /products/. */
  summary: string;
  status: ProductStatus;
  /** Public address of the product. Omitted for products that are not yet available. */
  url?: string;
  /** Label for the launch action. */
  action?: string;
}

export const PRODUCTS: readonly Product[] = [
  {
    id: 'work',
    name: 'Work',
    fullName: 'KEVOS® Work',
    tagline: 'Get more done. Work smarter.',
    summary: 'A general-purpose productivity and work platform. Bring your everyday work into one place and move it forward.',
    status: 'available',
    url: 'https://work.kevos.com/',
    action: 'Open Work',
  },
  {
    id: 'cados',
    name: 'CADOS',
    fullName: 'KEVOS® CADOS',
    tagline: 'Engineering and CAD intelligence.',
    summary: 'Automation and intelligence for engineering and SOLIDWORKS® work, so design and CAD tasks take less effort.',
    status: 'available',
    url: 'https://cados.kevos.com/',
    action: 'Open CADOS',
  },
  {
    id: 'desk',
    name: 'Desk',
    fullName: 'KEVOS® Desk',
    tagline: 'Your desktop, working smarter.',
    summary: 'A planned desktop productivity and automation product. It is not available yet.',
    status: 'soon',
  },
] as const;

export interface Solution {
  id: string;
  name: string;
  /** One line for menus. */
  short: string;
  /** The everyday problems this area addresses, in the customer's words. */
  problems: readonly string[];
  /** Where to go on KEVOS®: real pages and products only. */
  paths: readonly { label: string; href: string; note: string }[];
}

export const SOLUTIONS: readonly Solution[] = [
  {
    id: 'business-productivity',
    name: 'Business productivity',
    short: 'Plan, track and finish everyday work.',
    problems: [
      'Work is scattered across emails, spreadsheets and chat threads.',
      'Costing, quoting and investment decisions wait on numbers someone has to work out by hand.',
      'Teams need a clear method for a business case or a project plan, not another blank page.',
    ],
    paths: [
      { label: 'Work', href: 'https://work.kevos.com/', note: 'One place for everyday work.' },
      { label: 'Business tools', href: '/tools/?topic=business-commercial', note: 'Costing, quoting and investment calculators.' },
      { label: 'Business books', href: '/reados/?topic=business', note: 'Finance, strategy and governance, chapter by chapter.' },
    ],
  },
  {
    id: 'engineering-design',
    name: 'Engineering and design',
    short: 'Calculations, CAD and design checks.',
    problems: [
      'Checking a design calculation takes longer than the design itself.',
      'CAD and drawing tasks are repeated by hand on every job.',
      'The method you need is buried in a textbook you do not have to hand.',
    ],
    paths: [
      { label: 'CADOS', href: 'https://cados.kevos.com/', note: 'Engineering and CAD intelligence.' },
      { label: 'Engineering tools', href: '/tools/?topic=engineering-design', note: 'Design checks that show their method.' },
      { label: 'Engineering books', href: '/reados/?topic=engineering', note: 'Practical methods with worked numbers.' },
    ],
  },
  {
    id: 'automation-workflows',
    name: 'Automation and workflows',
    short: 'Take the repetition out of routine work.',
    problems: [
      'The same steps are repeated every week by the same people.',
      'Information is copied by hand between people, files and systems.',
      'It is not clear which processes are worth automating first.',
    ],
    paths: [
      { label: 'CADOS', href: 'https://cados.kevos.com/', note: 'Automation for engineering and CAD work.' },
      { label: 'Technology books', href: '/reados/?topic=technology', note: 'AI, software and digital systems in practice.' },
      { label: 'Talk to KEVOS®', href: '/contact/', note: 'Turn a repeated spreadsheet or manual process into a focused tool.' },
    ],
  },
] as const;

/** Products that can be opened today. */
export const AVAILABLE_PRODUCTS = PRODUCTS.filter((p) => p.status === 'available' && p.url);
