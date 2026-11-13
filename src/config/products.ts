// BIZOMAT products and solution areas: one source for the homepage, /products/ and /solutions/.
//
// Rules:
//  - Describe only what the products do today (src/data/platform-catalog.ts records where each fact comes from).
//  - A product with status 'soon' has no URL and is never shown as a link or as available.
//  - Links in solutions point only at pages that exist on this site or at a product's own address.
import { CAD, CRM, RESOURCES, WORK } from '../data/platform-catalog.ts';

export type ProductStatus = 'available' | 'soon';

export interface Product {
  id: string;
  /** Short product name as used in navigation ("CAD Automation"); `fullName` is the parent-brand form. */
  name: string;
  fullName: string;
  /** The name the product had before BIZOMAT, for visitors who know it by that name. */
  formerly?: string;
  /** One line, used in menus and cards. */
  tagline: string;
  /** Two or three plain sentences for the product card and /products/. */
  summary: string;
  status: ProductStatus;
  /** The product's page on this site. Omitted for products that are not yet available. */
  url?: string;
  /** Whether using it needs an account. */
  signIn: boolean;
  /** Label for the main action. */
  action?: string;
}

export const PRODUCTS: readonly Product[] = [
  {
    id: 'cad',
    name: 'CAD Automation',
    fullName: 'BIZOMAT CAD Automation',
    formerly: CAD.formerly,
    tagline: CAD.headline,
    summary: CAD.summary,
    status: 'available',
    url: '/cad-automation/',
    signIn: true,
    action: 'Explore CAD Automation',
  },
  {
    id: 'work',
    name: 'Project Management',
    fullName: 'BIZOMAT Project Management',
    formerly: WORK.formerly,
    tagline: WORK.headline,
    summary: WORK.summary,
    status: 'available',
    url: '/work/',
    signIn: true,
    action: 'Explore Project Management',
  },
  {
    id: 'crm',
    name: CRM.name,
    fullName: `BIZOMAT ${CRM.name}`,
    tagline: CRM.headline,
    summary: CRM.summary,
    status: 'available',
    url: '/crm-platform/',
    signIn: true,
    action: 'Explore the CRM',
  },
  {
    id: 'resources',
    name: 'Resources',
    fullName: 'BIZOMAT Resources',
    tagline: RESOURCES.headline,
    summary: RESOURCES.summary,
    status: 'available',
    url: '/resources/',
    signIn: false,
    action: 'Explore Resources',
  },
] as const;

/** Announced but not available: shown as text only, never as a link. */
export const PLANNED: readonly Product[] = [
  {
    id: 'desk',
    name: 'Desk',
    fullName: 'BIZOMAT Desk',
    tagline: 'Your desktop, working smarter.',
    summary: 'A planned desktop productivity and automation product. It is not available yet.',
    status: 'soon',
    signIn: true,
  },
] as const;

export interface Solution {
  id: string;
  name: string;
  /** One line for menus. */
  short: string;
  /** The everyday problems this area addresses, in the customer's words. */
  problems: readonly string[];
  /** Where to go on BIZOMAT: real pages and products only. */
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
      { label: 'Project Management', href: '/work/', note: 'Projects, tasks and teams in one workspace.' },
      { label: 'Customer Relationship Management', href: '/crm-platform/', note: 'Customers, leads, deals and follow-ups with your team.' },
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
      { label: 'CAD Automation', href: '/cad-automation/', note: 'Your AI assistant, working in SOLIDWORKS.' },
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
      { label: 'CAD Automation', href: '/cad-automation/', note: 'Automation for engineering and CAD work.' },
      { label: 'Technology books', href: '/reados/?topic=technology', note: 'AI, software and digital systems in practice.' },
      { label: 'Project Management automations', href: '/work/#automations', note: 'Let status changes and dates move routine work forward.' },
      { label: 'CRM automations', href: '/crm-platform/#automations', note: 'Follow-ups, reminders and alerts when leads and deals change.' },
      { label: 'Talk to BIZOMAT', href: '/contact/', note: 'Turn a repeated spreadsheet or manual process into a focused tool.' },
    ],
  },
] as const;

/** Products that can be opened today. */
export const AVAILABLE_PRODUCTS = PRODUCTS.filter((p) => p.status === 'available' && p.url);
