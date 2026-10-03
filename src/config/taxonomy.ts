// Controlled taxonomy for Insights.
// Categories = navigation (exactly one per article). Tags = discovery (2–5 per article).
// The content schema rejects any category or tag that is not listed here, so the archive
// cannot fragment into synonyms ("ai", "AI-tools", "artificial-intelligence"…).

export const CATEGORIES = {
  // Service-aligned categories for engineering and manufacturing articles. A category page and filter
  // appear only once it has published articles, so empty categories never show.
  engineering: {
    name: 'Engineering',
    description: 'CAD, drawings, documentation and practical engineering.',
  },
  manufacturing: {
    name: 'Manufacturing',
    description: 'Production, tooling, jigs and fixtures, and manufacturing problem solving.',
  },
  operations: {
    name: 'Operations',
    description: 'Process improvement, workflow, standardisation and production systems.',
  },
  projects: {
    name: 'Projects',
    description: 'Scoping, delivering and closing out engineering projects.',
  },
  ideas: {
    name: 'Ideas',
    description: 'Observations, concepts and exploratory thinking.',
  },
  products: {
    name: 'Products',
    description: 'Product creation, validation, design and manufacturing.',
  },
  technology: {
    name: 'Technology',
    description: 'Software, AI, digital systems and technical developments.',
  },
  business: {
    name: 'Business',
    description: 'Operations, building businesses, systems and decisions.',
  },
} as const;

export type CategorySlug = keyof typeof CATEGORIES;
export const CATEGORY_SLUGS = Object.keys(CATEGORIES) as [CategorySlug, ...CategorySlug[]];
/** Frontmatter uses the display name ("Products"); URLs use the slug ("products"). */
export const CATEGORY_NAMES = CATEGORY_SLUGS.map((slug) => CATEGORIES[slug].name) as [string, ...string[]];
export const categorySlug = (name: string): CategorySlug =>
  CATEGORY_SLUGS.find((slug) => CATEGORIES[slug].name === name) ?? 'ideas';

export const TAGS = {
  'product-development': 'Product development',
  manufacturing: 'Manufacturing',
  prototyping: 'Prototyping',
  design: 'Design',
  automation: 'Automation',
  ai: 'AI',
  systems: 'Systems',
  operations: 'Operations',
  strategy: 'Strategy',
  experimentation: 'Experimentation',
  customers: 'Customers',
  validation: 'Validation',
  'process-improvement': 'Process improvement',
  finance: 'Finance',
  sales: 'Sales',
} as const;

export type TagSlug = keyof typeof TAGS;
export const TAG_SLUGS = Object.keys(TAGS) as [TagSlug, ...TagSlug[]];
export const tagLabel = (slug: string) => TAGS[slug as TagSlug] ?? slug;
