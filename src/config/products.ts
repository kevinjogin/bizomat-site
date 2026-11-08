// BIZOMAT products: one source for the homepage cards and structured data.
//
// Rules:
//  - Describe only what the products do today (src/data/platform-catalog.ts records where each fact comes from).
//  - A product with status 'soon' has no URL and is never shown as a link or as available.
import { CAD, WORK } from '../data/platform-catalog.ts';

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
  /** Two or three plain sentences for the product card. */
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
] as const;
