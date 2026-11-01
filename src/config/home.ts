// Homepage picks. Every id must exist: tool ids in the WORKOS register (public/tools/data-*.js) and book ids as the
// READOS library names them (publication-<book>, collection-<book> or guide-<slug>). The build stops if one is missing.
// Counts on the homepage are never written here; they are read from the catalogues at build time.

/** WORKOS tools shown under "Featured tools", one from each of several topics. */
export const HOME_FEATURED_TOOLS = [
  'bolt-torque-preload',
  'bearing-l10-life',
  'cutting-speed',
  'hydraulic-cylinder',
  'process-capability',
  'investment-appraisal',
];

/** READOS books shown under "Featured books", one from each of several subjects. */
export const HOME_FEATURED_BOOKS = [
  'publication-bolted-joints-by-the-numbers',
  'publication-sheet-metal-parts-by-the-numbers',
  'publication-shop-floor-optimisation-by-the-numbers',
  'publication-front-end-planning-by-the-numbers',
  'publication-engineering-tools-people-use',
  'collection-investment-appraisal-and-business-cases',
];

/** The four hero orbit nodes: what people do, the WORKOS topic it opens and the READOS subject counted beside it. */
export const HOME_ORBIT = [
  { verb: 'Design', topic: 'engineering-design', subject: 'engineering' },
  { verb: 'Build', topic: 'manufacturing-production', subject: 'manufacturing' },
  { verb: 'Operate', topic: 'maintenance-reliability', subject: 'operations' },
  { verb: 'Improve', topic: 'projects-improvement', subject: 'projects' },
];
