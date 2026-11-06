// Product naming shared by the Worker and the app. Project Management is part of the BIZOMAT platform.
// The client adds the logo, colours and platform links in src/client/lib/brand.ts.

export const PRODUCT = {
  platform: 'BIZOMAT',
  name: 'Project Management',
  full: 'BIZOMAT Project Management',
} as const;

/**
 * Colour given to NEW workspaces and folders: BIZOMAT teal (BRAND_COLORS.teal in the generated
 * src/client/lib/bizomat-brand.ts; test/brand.test.ts keeps the two equal). Existing workspaces and
 * folders keep the colour their owners chose: no migration rewrites it.
 */
export const DEFAULT_COLOR = '#0f766e';
