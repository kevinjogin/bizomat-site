// Single source of truth for branding. WorkOS is a KEVOS product.
export const BRAND = {
  company: 'KEVOS',
  product: 'WorkOS',
  full: 'KEVOS WorkOS',
  tagline: 'Work management, part of the KEVOS suite',
  orange: '#F97316',
  /** Where privacy requests go. Change if you use a dedicated address. */
  privacyContact: 'kevin@kevos.com',
  privacyUpdated: '4 November 2026',
} as const;

export function pageTitle(...parts: (string | null | undefined)[]) {
  return [...parts.filter(Boolean), BRAND.full].join(' · ');
}
