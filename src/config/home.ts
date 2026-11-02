// Homepage picks. Every id must exist: tool ids in the KEVOS® register (public/tools/data-*.js) and book ids as the
// Library names them (publication-<book>, collection-<book> or guide-<slug>). The build stops if one is missing.
// Counts on the homepage are never written here; they are read from the catalogues at build time.

/** KEVOS® tools shown under "Featured tools", one from each of several topics. */
export const HOME_FEATURED_TOOLS = [
  'bolt-torque-preload',
  'bearing-l10-life',
  'cutting-speed',
  'hydraulic-cylinder',
  'process-capability',
  'investment-appraisal',
];

/** Library books shown under "Featured books", one from each of several subjects. */
export const HOME_FEATURED_BOOKS = [
  'publication-bolted-joints-by-the-numbers',
  'publication-sheet-metal-parts-by-the-numbers',
  'publication-shop-floor-optimisation-by-the-numbers',
  'publication-front-end-planning-by-the-numbers',
  'publication-engineering-tools-people-use',
  'collection-investment-appraisal-and-business-cases',
];

/** The four hero orbit nodes: what people do, the KEVOS® topic it opens and the Library subject counted beside it. */
export const HOME_ORBIT = [
  { verb: 'Design', topic: 'engineering-design', subject: 'engineering' },
  { verb: 'Build', topic: 'manufacturing-production', subject: 'manufacturing' },
  { verb: 'Operate', topic: 'maintenance-reliability', subject: 'operations' },
  { verb: 'Improve', topic: 'projects-improvement', subject: 'projects' },
];

/** Example questions under the homepage discovery box ("What would you like to solve today?"). */
export const HOME_DISCOVERY_EXAMPLES = [
  'How do I calculate manufacturing costs?',
  'How can I reduce machine downtime?',
  'Help me calculate CNC machining parameters.',
  'Where can I find engineering tolerance references?',
  'How can I improve business productivity?',
  'Help me understand machine operating costs.',
] as const;
