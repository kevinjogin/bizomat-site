// KEVOS's commercial offer: services, indicative packages, Factory Fix, engagement process and industries.
// Single source of truth: pages and the website assistant both read from here, so prices and wording
// only ever need changing in one place.

export interface ServiceGroup {
  id: string;
  title: string;
  short: string;
  summary: string;
  items: string[];
  deliverables: string[];
}

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: 'engineering-cad',
    title: 'Engineering and CAD Support',
    short: 'CAD, SolidWorks, drawing updates, production documentation and design-for-manufacture support.',
    summary:
      'Clear, accurate engineering documentation that production, suppliers and customers can work from. Suited to backlogs of drawing changes, products that need proper documentation, or designs that need to be made easier to manufacture.',
    items: [
      'SolidWorks support',
      '3D CAD modelling',
      '2D manufacturing drawings',
      'Drawing changes and revisions',
      'Design documentation',
      'Production drawings',
      'Design-for-manufacture support',
      'Assembly documentation',
      'Engineering documentation clean-up',
      'Drawing conversion where appropriate',
    ],
    deliverables: ['3D models', '2D drawings and revisions', 'Assembly documentation', 'Documentation packs in agreed formats'],
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing Support',
    short: 'Jigs, fixtures, tooling concepts, production layouts, work instructions and manufacturing problem solving.',
    summary:
      'Hands-on support to make production more repeatable: practical workholding and tooling concepts, layouts that suit the work, and instructions people can follow on the floor.',
    items: [
      'Jig concepts',
      'Fixture concepts',
      'Production tooling concepts',
      'Manufacturing documentation',
      'Production layouts',
      'Work instructions',
      'Assembly documentation',
      'Production-readiness support',
      'Manufacturing problem solving',
      'Continuous-improvement implementation support',
    ],
    deliverables: ['Concept models and drawings', 'Layout options', 'Work instructions', 'Problem-solving summaries and action plans'],
  },
  {
    id: 'operations',
    title: 'Operations Improvement',
    short: 'Process mapping, workflow improvement, waste reduction, standardisation and production-readiness work.',
    summary:
      'A structured look at how work actually flows, where time and effort are lost, and what practical changes would make the operation more stable and easier to run.',
    items: [
      'Process mapping',
      'Workflow review',
      'Value-stream review',
      'Waste identification',
      'Production flow improvement',
      'Standardisation',
      'Capacity improvement',
      'Visual management',
      'Work instructions',
      'SOP development',
      'Process documentation',
    ],
    deliverables: ['Current and future-state process maps', 'Improvement recommendations', 'SOPs and work instructions', 'Implementation action plans'],
  },
  {
    id: 'project-support',
    title: 'Engineering Project Support',
    short: 'Scopes, RFQs, project documentation, contractor coordination, commissioning documentation and handover.',
    summary:
      'Practical support to get engineering projects defined, documented and delivered, from the first scope through to commissioning paperwork and close-out.',
    items: [
      'Project scopes',
      'RFQ documentation',
      'Technical specifications',
      'Project planning',
      'Supplier and contractor coordination support',
      'Project documentation',
      'Risk and action tracking',
      'Commissioning documentation',
      'Handover documentation',
      'Project close-out support',
    ],
    deliverables: ['Scopes and specifications', 'RFQ packs', 'Plans, risk and action registers', 'Commissioning and handover documents'],
  },
];

export interface ServicePackage {
  title: string;
  price: string;
  /** Lowest indicative price in AUD, for structured data. Undefined when quoted to scope. */
  minPrice?: number;
  description: string;
  service: string;
}

export const PACKAGES: ServicePackage[] = [
  { title: 'Drawing and CAD Update', price: 'From A$250', minPrice: 250, service: 'Engineering / CAD', description: 'Revisions, updates or clean-up of existing models and drawings.' },
  { title: 'Manufacturing Documentation Package', price: 'From A$600', minPrice: 600, service: 'Manufacturing Support', description: 'Drawings and documentation prepared so a part or assembly can be made consistently.' },
  { title: 'Procedures and Work Instructions', price: 'From A$350', minPrice: 350, service: 'Operations Improvement', description: 'Clear, usable standard operating procedures or work instructions for a defined task.' },
  { title: 'Process Improvement Review', price: 'From A$750', minPrice: 750, service: 'Operations Improvement', description: 'A structured review of a process, with findings and practical recommendations.' },
  { title: 'Jig or Fixture Concept Package', price: 'From A$700', minPrice: 700, service: 'Manufacturing Support', description: 'Concept design for a jig or fixture to improve repeatability, speed or safety.' },
  { title: 'Engineering Support Day', price: 'From approx. A$750', minPrice: 750, service: 'Engineering / CAD', description: 'A day of engineering, CAD, documentation or improvement support on agreed tasks.' },
  { title: 'Small Engineering Improvement Project', price: 'Quoted to scope', service: 'Project Support', description: 'A defined improvement project, scoped and quoted before work begins.' },
  { title: 'Ongoing Technical Support', price: 'Monthly retainer available', service: 'Ongoing Support', description: 'Regular engineering and documentation support on an agreed monthly basis.' },
];

export const PRICING_NOTE =
  'Pricing is indicative only and depends on scope, complexity, site requirements and deliverables. GST applies where applicable.';

export const FACTORY_FIX = {
  name: 'KEVOS Factory Fix',
  price: 'From A$990',
  minPrice: 990,
  summary:
    'A focused engineering or manufacturing improvement engagement for businesses with one defined production, workflow, documentation or engineering problem that needs to be moved forward.',
  deliverables: [
    'Problem review',
    'Current-state understanding',
    'Key observations',
    'Improvement opportunities',
    'Recommended action plan',
    'One agreed supporting document where appropriate',
  ],
  documents: ['Process map', 'SOP', 'Work instruction', 'Technical action list', 'Production-improvement plan', 'Drawing or documentation recommendation'],
  examples: [
    'A recurring quality or rework problem on one product or process',
    'A bottleneck that keeps holding up a production line or workflow',
    'A job that depends on one person’s knowledge and needs to be documented',
    'A fixture, layout or setup that wastes time on every run',
    'Drawings or documentation that keep causing questions on the floor',
  ],
  terms: 'Final scope, deliverables and commercial terms are agreed before commencement.',
} as const;

export const PROCESS = [
  {
    title: 'Tell us the problem',
    text: 'Describe the job, the problem or the project. Drawings, photos and a short explanation are usually enough to start the conversation.',
  },
  {
    title: 'Scope the work',
    text: 'KEVOS defines the scope, deliverables, assumptions, timing and commercial terms in writing before substantial work begins.',
  },
  {
    title: 'Complete the engineering work',
    text: 'The agreed work is carried out, with check-ins at sensible points so questions are answered early rather than at the end.',
  },
  {
    title: 'Deliver and close out',
    text: 'Deliverables are handed over in agreed formats, questions are answered and the work is closed out cleanly.',
  },
] as const;

export const ENGAGEMENT_MODELS = [
  { title: 'Fixed-price proposals', text: 'Encouraged for suitable small assignments with a clear scope and defined deliverables.' },
  { title: 'Staged discovery', text: 'For problems that are not yet well defined: a short first stage clarifies the problem before the main work is quoted.' },
  { title: 'Day rate or time-based work', text: 'For flexible or evolving tasks where the scope is hard to fix in advance.' },
  { title: 'Monthly support', text: 'Ongoing engineering and documentation support on an agreed monthly arrangement.' },
] as const;

export const INDUSTRIES = [
  { title: 'Manufacturing', text: 'Production processes, documentation, tooling and flow for general manufacturers.' },
  { title: 'Fabrication', text: 'Drawings, fixtures and workflow for metal and other fabrication businesses.' },
  { title: 'Industrial equipment', text: 'Engineering documentation and project support for equipment builders and suppliers.' },
  { title: 'Building-product manufacturing', text: 'Process, documentation and production support for building-product makers.' },
  { title: 'Plastics and components', text: 'Documentation, tooling concepts and process support for component producers.' },
  { title: 'Assembly operations', text: 'Work instructions, layouts and standardisation for assembly work.' },
  { title: 'Small and medium OEMs', text: 'Engineering capability without adding permanent engineering headcount.' },
  { title: 'Production businesses', text: 'Practical improvement for businesses that make things every day.' },
  { title: 'Engineering suppliers', text: 'Drawings, RFQ documentation and project support for suppliers to industry.' },
] as const;

/** Values for the contact form's "Service required" field (and ?service= links). */
export const SERVICE_OPTIONS = [
  { value: 'Engineering / CAD', slug: 'engineering-cad' },
  { value: 'Manufacturing Support', slug: 'manufacturing' },
  { value: 'Operations Improvement', slug: 'operations' },
  { value: 'Project Support', slug: 'project-support' },
  { value: 'Factory Fix', slug: 'factory-fix' },
  { value: 'Ongoing Support', slug: 'ongoing-support' },
  { value: 'Other', slug: 'other' },
] as const;

export const SOFTWARE = {
  title: 'Professionally equipped for commercial work',
  text: 'KEVOS uses commercially licensed engineering and productivity software for professional client work, including licensed SolidWorks/CAD software and Microsoft Office productivity tools, to produce client-ready engineering and project documentation.',
  trademarks:
    'SOLIDWORKS is a registered trademark of Dassault Systèmes or its subsidiaries. Microsoft, Microsoft 365 and Office are trademarks of the Microsoft group of companies. KEVOS is not affiliated with, endorsed by or a partner of these companies.',
} as const;

export const SERVICE_AREA = 'Sydney and NSW businesses, with suitable remote engineering and documentation support available elsewhere in Australia.';
