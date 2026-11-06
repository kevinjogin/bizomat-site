// Homepage picks. Every id must exist: tool ids in the BIZOMAT register (public/tools/data-*.js) and book ids as the
// Library names them (publication-<book>, collection-<book> or guide-<slug>). The build stops if one is missing.
// Counts on the homepage are never written here; they are read from the catalogues at build time.

/** BIZOMAT tools shown under "Featured tools", one from each of several topics. */
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

/**
 * Example searches under the homepage AI Search box. The short label is what the visitor sees; the question is what it
 * puts in the box (they can edit it before asking). Each one leads to real BIZOMAT pages, tools or Library chapters:
 * the search recommends what exists; it does not open files or carry out the task.
 */
export const HOME_DISCOVERY_EXAMPLES = [
  { label: 'Engineering calculators', question: 'Find a tool to calculate engineering dimensions.' },
  { label: 'Automate SOLIDWORKS', question: 'How can I automate SolidWorks?' },
  { label: 'Project management', question: 'Show me project management capabilities.' },
  { label: 'Business automation guides', question: 'Find guides about business automation.' },
] as const;

/** Example requests for the learning-path box in the Tools and Library page headers (LearningPlanner.astro). */
export const PLANNER_EXAMPLES = {
  tools: [
    'Teach me how to calculate manufacturing costs.',
    'Help me understand bolted joint design and the calculations behind it.',
    'I want to learn how to size motors and variable-speed drives.',
  ],
  library: [
    'Teach me mechanical engineering from beginner to advanced.',
    'I want to learn engineering project management.',
    'Help me understand lean manufacturing and continuous improvement.',
  ],
} as const;
