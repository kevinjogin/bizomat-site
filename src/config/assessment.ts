// BIZOMAT Engineering Problem Assessment: the single source of truth for /assessment/, the site-wide
// promotions, the BIZOMAT Assistant, the intake form and the PDF and brochure generators
// (scripts/assessment/). Change wording, price or terms here and every surface follows.
//
// Keep this file dependency-free: it is imported by Astro pages, the Worker, Node tests and scripts.
// Items marked OWNER-APPROVAL are proposed defaults that the business owner must confirm
// (see docs/assessment/README.md).

export const ASSESSMENT = {
  name: 'BIZOMAT Engineering Problem Assessment',
  shortName: 'Engineering Problem Assessment',
  path: '/assessment/',
  /** Fixed fee in whole Australian dollars. */
  price: 195,
  currency: 'AUD',
  priceLabel: 'A$195',
  priceCaption: 'Fixed-price remote assessment',
  /**
   * OWNER-APPROVAL: GST registration has not been verified. Until it is, the site keeps its standing
   * wording and the payment request states the exact amount payable before anything is paid.
   */
  gstNote: 'GST applies where applicable. The exact amount payable is confirmed in writing before you pay.',
  meetingMinutes: 30,
  heroTitle: 'Engineering problems. <em>Clear next steps.</em>',
  heroLines: [
    'One defined engineering or manufacturing problem.',
    'A focused technical review.',
    'Practical recommendations.',
    'A clear way forward.',
  ],
  description: [
    'Not every manufacturing or mechanical design problem requires a major consulting engagement.',
    'BIZOMAT provides a practical, fixed-price remote assessment to help businesses understand a defined problem, review potential improvement options and identify the next step.',
  ],
  summary:
    'A fixed-price remote review of one defined engineering or manufacturing problem: a 30-minute technical discussion, a preliminary review of the information you supply, up to three improvement options and a one-page written recommendation.',
  seo: {
    title: 'Engineering Problem Assessment Australia',
    description:
      'A focused engineering or manufacturing problem assessment from BIZOMAT. A$195 for a defined remote technical review with practical written recommendations.',
  },
  successMessage:
    'Your assessment enquiry has been received. BIZOMAT will review the information and confirm whether the problem is suitable for the fixed-price assessment.',
} as const;

export interface Inclusion {
  number: string;
  title: string;
  text: string;
  points?: readonly string[];
}

export const INCLUSIONS: readonly Inclusion[] = [
  { number: '01', title: 'Problem understanding', text: 'Review of one clearly defined engineering or manufacturing problem.' },
  { number: '02', title: 'Technical discussion', text: 'Up to 30 minutes of remote discussion to clarify the problem, the constraints and what has already been tried.' },
  {
    number: '03',
    title: 'Preliminary technical review',
    text: 'Review of a limited amount of drawings, photographs or process information you supply.',
    points: ['Preliminary observations', 'Possible causes', 'Relevant technical considerations'],
  },
  { number: '04', title: 'Improvement options', text: 'Up to three practical improvement options, where the available evidence permits.' },
  {
    number: '05',
    title: 'Written recommendation',
    text: 'A professional one-page PDF that you can share with your team.',
    points: [
      'Problem statement',
      'Information reviewed',
      'Preliminary findings',
      'Potential improvement options',
      'Recommended next action',
      'Assumptions and limitations',
      'Possible follow-on work',
    ],
  },
];

/** Things the fixed fee does not cover (shown before any enquiry or payment). */
export const EXCLUSIONS = [
  'Physical inspection',
  'Site visits',
  'Detailed CAD modelling',
  'Manufacturing drawings',
  'Prototypes',
  'Testing',
  'Formal certification',
  'Regulated design sign-off',
  'Guaranteed root-cause identification',
  'Guaranteed savings',
  'Detailed implementation work',
] as const;

export interface Example {
  id: string;
  title: string;
  problem: string;
  provide: readonly string[];
  identify: readonly string[];
  next: string;
}

/** Illustrative problem types. Examples, not guaranteed outcomes. */
export const EXAMPLES: readonly Example[] = [
  {
    id: 'alignment',
    title: 'Assembly alignment problems',
    problem: 'Parts that need shims, force or re-drilling to fit, holes that do not line up, or assemblies that vary from one build to the next.',
    provide: ['Photographs of the assembly and the misalignment', 'Drawings of the mating parts', 'How the parts are located and fastened', 'How often it happens'],
    identify: ['Whether location relies on clearance holes or edges rather than defined datums', 'Possible tolerance stack-up or distortion sources', 'Where a locating feature or a change of sequence could help'],
    next: 'Measure a small sample of parts at the critical features, then a tolerance review or a fixture concept.',
  },
  {
    id: 'fixture',
    title: 'Jig and fixture requirements',
    problem: 'A part that is hard to hold, locate or repeat, set-ups that depend on operator skill, or a new job that needs a fixture.',
    provide: ['Part drawings or models', 'Photographs of the current set-up', 'The process and typical quantities', 'Features that are critical to tolerance'],
    identify: ['Suitable locating and clamping principles', 'Which features to locate from', 'Likely loading, access and swarf or weld-spatter issues'],
    next: 'A jig or fixture concept package, quoted separately.',
  },
  {
    id: 'process',
    title: 'Manufacturing process difficulties',
    problem: 'A step that causes rework, scrap, delays or inconsistent results.',
    provide: ['A description or sketch of the process flow', 'Photographs of the step', 'Examples of defects or rework', 'Any data you already record'],
    identify: ['Where variation is most likely introduced', 'The questions that data should answer', 'Quick checks that separate possible causes'],
    next: 'A short data-collection plan, a Process Improvement Review or a Factory Fix.',
  },
  {
    id: 'modification',
    title: 'Mechanical product modifications',
    problem: 'A product change for a new requirement, a cost reduction, a supplier change or a recurring field issue.',
    provide: ['Current drawings or models', 'The reason for the change', 'Constraints such as interfaces, standards and volumes'],
    identify: ['The interfaces and parts affected', 'Risks that need checking before the change', 'Design options worth developing'],
    next: 'A scoped design and CAD update.',
  },
  {
    id: 'cad',
    title: 'CAD and drawing-related problems',
    problem: 'Drawings that cause questions on the floor or from suppliers, models that are hard to change, or missing and out-of-date revisions.',
    provide: ['Example drawings or models', 'The questions or errors they cause', 'How revisions are currently controlled'],
    identify: ['Missing dimensions, tolerances or datums', 'Ambiguous notes and views', 'Model structure and revision-control gaps'],
    next: 'A Drawing and CAD Update.',
  },
  {
    id: 'dfm',
    title: 'Design for manufacture challenges',
    problem: 'Parts that are costly or difficult to make, inspect or assemble.',
    provide: ['Drawings or models', 'The manufacturing method and any supplier feedback', 'Typical quantities'],
    identify: ['Features that drive cost or difficulty', 'Tolerance and material considerations', 'Alternative manufacturing methods to consider'],
    next: 'A design-for-manufacture review as a quoted engagement.',
  },
  {
    id: 'documentation',
    title: 'Production documentation improvements',
    problem: 'Work instructions or procedures that are missing, out of date or not followed.',
    provide: ['Current documents', 'Photographs of the task', 'Who uses the documents and where'],
    identify: ['Gaps and unclear steps', 'Missing quality checks', 'Formats that suit the shop floor'],
    next: 'A Procedures and Work Instructions package.',
  },
  {
    id: 'manual',
    title: 'Repetitive manual assembly tasks',
    problem: 'Assembly steps that are slow, awkward, error-prone or tiring when repeated many times.',
    provide: ['A short video or photographs of the task', 'Quantities per shift or per week', 'The parts involved', 'The main difficulty, as the operators describe it'],
    identify: ['Handling and orientation issues', 'Mistake-proofing opportunities', 'Simple fixtures or tools to consider'],
    next: 'A fixture or mistake-proofing concept, or a Factory Fix.',
  },
];

export type Actor = 'You' | 'BIZOMAT';
export interface JourneyStep {
  number: string;
  actor: Actor;
  title: string;
  text: string;
}
export interface JourneyPhase {
  title: string;
  steps: readonly JourneyStep[];
}

/** The customer journey. Payment only follows scope approval; a booking exists only once the calendar confirms it. */
export const JOURNEY: readonly JourneyPhase[] = [
  {
    title: 'Explore and enquire',
    steps: [
      { number: '01', actor: 'You', title: 'Visit', text: 'Open this page.' },
      { number: '02', actor: 'You', title: 'Review', text: 'Check the price, inclusions, exclusions and terms.' },
      { number: '03', actor: 'You', title: 'Enquire', text: 'Submit the assessment enquiry. No payment is taken.' },
    ],
  },
  {
    title: 'Confirm and pay',
    steps: [
      { number: '04', actor: 'BIZOMAT', title: 'Suitability check', text: 'BIZOMAT checks technical and commercial suitability and may ask for more information.' },
      { number: '05', actor: 'BIZOMAT', title: 'Scope confirmed', text: 'BIZOMAT confirms the scope in writing and sends payment instructions.' },
      { number: '06', actor: 'You', title: 'Payment', text: 'You pay A$195 using the payment instructions provided.' },
      { number: '07', actor: 'BIZOMAT', title: 'Payment verified', text: 'BIZOMAT verifies the payment before anything is booked.' },
    ],
  },
  {
    title: 'Book and assess',
    steps: [
      { number: '08', actor: 'BIZOMAT', title: 'Booking instructions', text: 'You receive instructions for booking the meeting.' },
      { number: '09', actor: 'You', title: 'Book', text: 'Book a 30-minute remote meeting. It is confirmed when the calendar confirmation arrives.' },
      { number: '10', actor: 'BIZOMAT', title: 'Assessment', text: 'The discussion and the preliminary technical review.' },
    ],
  },
  {
    title: 'Recommend',
    steps: [
      { number: '11', actor: 'BIZOMAT', title: 'Report', text: 'BIZOMAT delivers the one-page PDF recommendation.' },
      { number: '12', actor: 'You', title: 'Next steps', text: 'Request further engineering work if you choose. It is scoped and quoted separately.' },
    ],
  },
];

/** Commercial conditions shown before any enquiry or payment. OWNER-APPROVAL: rescheduling and refund wording. */
export const CONDITIONS: readonly { title: string; text: string }[] = [
  { title: 'One defined problem', text: 'The A$195 assessment covers one defined problem only. Related or additional problems need a separate assessment or a quote.' },
  { title: 'A preliminary desktop assessment', text: 'It is a remote, preliminary engineering assessment based on the information you supply and the discussion. Findings depend on that information and are not a guarantee of a solution.' },
  { title: 'Payment after approval', text: 'Nothing is paid through this website. BIZOMAT requests payment only after confirming in writing that the problem is suitable and the scope is agreed. The fee is payable in full before the meeting is booked.' },
  { title: 'Rescheduling', text: 'You can reschedule the meeting at no cost by giving at least one business day’s notice.' },
  { title: 'Cancellation and refunds', text: 'Cancel before the meeting for a full refund. If BIZOMAT decides after payment that the problem cannot be assessed within this scope, it will tell you and refund the fee in full.' },
  { title: 'Further work', text: 'Any further engineering services require separate scoping and a written quote. There is no obligation to proceed.' },
  { title: 'Your rights', text: 'Nothing in these conditions excludes, restricts or modifies rights you have under the Australian Consumer Law.' },
];

export const FAQ_ITEMS: readonly { q: string; a: string }[] = [
  { q: 'When do I pay?', a: 'Only after BIZOMAT has reviewed your enquiry and confirmed in writing that the problem suits the fixed-price assessment. Payment instructions are sent with that confirmation. Nothing is charged through this website.' },
  { q: 'What if my problem is not suitable?', a: 'BIZOMAT will tell you, and there is no charge. Where it helps, you will be told what kind of work or specialist would suit the problem better, or offered a quote.' },
  { q: 'Can I send drawings and photographs?', a: 'Yes, after BIZOMAT replies. The enquiry form only asks what you can provide. Please do not paste confidential information into the form, and only share material you are entitled to share. A confidentiality agreement can be arranged first if you need one.' },
  { q: 'Will the assessment find the root cause?', a: 'Not necessarily. It is a preliminary review. It identifies possible causes, the technical considerations and the checks that would confirm or rule them out, but it cannot guarantee root-cause identification without measurement, inspection or testing.' },
  { q: 'Is a site visit included?', a: 'No. The assessment is fully remote. If a visit, measurement or hands-on work is needed, it can be scoped and quoted separately.' },
  { q: 'Is the report certified engineering advice?', a: 'No. The assessment is not formal certification or regulated design sign-off. Work that legally requires a registered engineer or certifier needs an appropriately qualified professional.' },
  { q: 'How long does it take?', a: 'The meeting takes up to 30 minutes. The expected delivery date for the one-page PDF is confirmed with the scope, before you pay.' },
  { q: 'Do I have to buy further work?', a: 'No. The recommendation may suggest follow-on work, but any further engineering is optional, scoped separately and quoted in writing.' },
];

/** When to choose the assessment and when to go straight to a Factory Fix or a quote. */
export const CHOOSING = {
  assessment: [
    'You have one defined problem and want an engineering view before committing to a larger engagement.',
    'You want to know the likely causes, the options and a sensible next step.',
    'Remote discussion of photographs, drawings or process information is enough to start.',
  ],
  factoryFix: [
    'The problem is known to be worth solving now and needs more than a preliminary view.',
    'You want current-state analysis, a prioritised action plan and a supporting document.',
    'Discussion with the people involved, or a site visit, is likely to be needed.',
  ],
  quote: 'Already know what you need, such as drawings, a fixture concept or work instructions? Request a free quote instead.',
} as const;

export const STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'] as const;

export const PROBLEM_CATEGORIES = [
  'Mechanical Design',
  'CAD / Drawings',
  'Jig & Fixture',
  'Manufacturing Process',
  'Assembly Problem',
  'Product Improvement',
  'Engineering Documentation',
  'Other',
] as const;

export const MATERIALS = ['Photographs', 'Drawings or CAD models', 'Process documents or data', 'Video', 'Nothing yet'] as const;

/** Internal workflow statuses (docs/assessment/README.md explains each stage). */
export const STATUSES = [
  'NEW',
  'NEEDS INFORMATION',
  'APPROVED',
  'PAYMENT PENDING',
  'PAID',
  'BOOKING PENDING',
  'BOOKED',
  'IN PROGRESS',
  'REPORT READY',
  'DELIVERED',
  'CLOSED',
  'DECLINED',
  'REFUNDED',
] as const;

/** Downloadable assets in public/assessment/ (generated by scripts/assessment/). */
export const ASSETS = {
  brochure: '/assessment/kevos-engineering-problem-assessment-brochure.pdf',
  sampleReport: '/assessment/kevos-sample-assessment-report.pdf',
  qrSvg: '/assessment/kevos-assessment-qr.svg',
  qrPng: '/assessment/kevos-assessment-qr.png',
  qrCard: '/assessment/kevos-assessment-qr-card.pdf',
  social: '/assessment/kevos-assessment-social.png',
  banner: '/assessment/kevos-assessment-banner.png',
} as const;

/**
 * Fictional sample report used on the page and in the sample PDF. It is clearly marked as a sample:
 * it is not client work and contains no real engineering evidence.
 */
export const SAMPLE_REPORT = {
  reference: 'BIZOMAT-A-SAMPLE-001',
  customer: 'Sample Manufacturing Co. (fictional)',
  date: '16 October 2026',
  problem:
    'A welded bracket does not seat consistently on its mounting plate during final assembly. Operators sometimes ream or slot the holes to fit the bolts, which adds time and varies between builds.',
  supplied: ['Three photographs of the bracket fitted to the plate (fictional sample)', 'PDF drawing of the bracket, revision B (fictional sample)', 'Operator description of the assembly sequence'],
  observations: [
    'Both mounting holes are dimensioned from the bracket edges rather than from a common datum.',
    'The holes are drilled before welding, and the photographs suggest some distortion near the weld.',
    'No locating feature controls the bracket’s position on the plate before the bolts go in.',
  ],
  factors: ['Weld distortion moving the hole positions', 'Tolerance stack-up between edge-referenced holes', 'Assembly sequence that relies on the bolts to locate the part'],
  options: [
    { title: 'Weld fixture with locating pins', text: 'Hold the hole positions during welding so distortion cannot move them.' },
    { title: 'Datum-referenced positional tolerance', text: 'Dimension both holes from one datum and make one hole a slot to absorb the remaining variation.' },
    { title: 'Drill after welding', text: 'Move hole drilling or reaming to after welding, if cost and access allow.' },
  ],
  nextStep: 'Measure the hole positions on ten brackets before and after welding to confirm whether distortion or the drawing tolerances dominate, then develop the matching option.',
  verification: ['Hole-position measurements on a sample of parts', 'Check of the plate’s own hole positions', 'Confirmation of the weld sequence used'],
  assumptions: [
    'Based only on the information supplied and a 30-minute discussion; no parts were inspected.',
    'Findings are preliminary and are not certification or design sign-off.',
    'Options need verification before implementation.',
  ],
  followOn: 'Jig or Fixture Concept Package, or a Drawing and CAD Update.',
} as const;
