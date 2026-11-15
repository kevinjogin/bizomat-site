// BIZOMAT WHS, Release 1: the jurisdiction packs seeded for platform administrators to verify (brief sections 3, 8 and
// 21 to 23). Platform data: written by legal.ts ensureSeed with INSERT OR IGNORE on fixed ids, so a platform
// administrator's later edits, verifications and new versions are never overwritten.
//
// Honesty rules (docs/whs/README.md):
// - Every instrument and every rule here is "Not verified". The app says so plainly: a competent person must verify it
//   against the official source before it is relied on. A rule applies to an incident only once it is verified.
// - No deadline, threshold or definition is stated as a fact: the text of each rule is a draft, pending verification,
//   and the structured deadline is left empty for the verifier to set.
// - source_check records exactly what the session that wrote this file could check, and when. On 15 Nov 2026 only
//   legislation.gov.au answered; every other official host below refused the connection from that session's network.
// - The brief's own warnings are modelled as effective-dated records, not code: the December 2025 model-law
//   notification amendments apply to no site by themselves (a reference pack) and wait as a draft version in each
//   harmonised jurisdiction until it enacts them; Victoria has its own pack under its own Act; the workplace exposure
//   limits change is a second version effective from 1 December 2026 (the date the brief gives).

export const SEED_VERSION = 1;

export interface SeedInstrument {
  id: string;
  kind: 'legislation' | 'regulation' | 'code_of_practice' | 'standard' | 'guidance' | 'model_law';
  title: string;
  citation?: string;
  industry?: string;
  url: string;
  amendedAt?: string;
  summary?: string;
  check: string;
}

export interface SeedRule {
  key: string;
  version: number;
  kind: 'notification' | 'site_preservation' | 'retention' | 'exposure_limits' | 'other';
  title: string;
  instrument?: string;
  provision?: string;
  url: string;
  from?: string;
  to?: string;
  body: string;
  criteria?: { kinds?: string[]; outcomes?: string[]; severities?: string[] };
  deadlineText?: string;
  requiredInfo?: string[];
  sitePreservation?: string;
  responsibleParty?: string;
  procedure?: string;
  retention?: string;
  regulator?: string;
  notifyUrl?: string;
  status: 'active' | 'draft';
  changeNote?: string;
  check: string;
}

export interface SeedPack {
  id: string;
  code: string;
  country: string;
  region: string;
  name: string;
  framework: string;
  regulator: string;
  regulatorUrl: string;
  assignable: boolean;
  coverage: 'core' | 'skeleton' | 'reference';
  notes: string;
  sort: number;
  instruments: SeedInstrument[];
  rules: SeedRule[];
}

const CHECKED_ON = '15 Nov 2026';
const refused = (host: string) => `Not reached on ${CHECKED_ON}: the network of the session that wrote this record refused the connection to ${host}. Nothing here was checked against the source.`;
const NOT_CHECKED = `Not checked on ${CHECKED_ON}: written from the brief and general knowledge only.`;

const CTH_ACT_CHECK =
  `Reached on ${CHECKED_ON} (06:46 UTC): the Federal Register of Legislation named the latest version of this Act compilation 16 (register ID C2024C00243), in force from 1 July 2024, and listed Part 3, Incident notification, sections 35 to 39 (what is a notifiable incident; what is a serious injury or illness; what is a dangerous incident; duty to notify of notifiable incidents; duty to preserve incident sites). The text of the sections was not read. This is not a verification.`;
const CTH_REGS_CHECK = `Reached on ${CHECKED_ON} (06:46 UTC): the Federal Register of Legislation named the latest version compilation 28 (register ID F2025C00381), in force from 25 March 2025. The text was not read. This is not a verification.`;

/** The questions a verifier answers before a notification rule is verified (shown as the draft's required information). */
const DRAFT_REQUIRED_INFO = [
  'Draft, not verified: confirm the regulator’s list of required information before relying on it.',
  'Who is notifying, and how to contact them',
  'The date, time and place of the incident',
  'What happened, and who was involved',
  'What has been done since: first aid, treatment, making the site safe',
];

const NOTIFY_DRAFT = (law: string) =>
  `Draft, not verified. ${law} A competent person must read the enacted law in force on the incident's date and set which incidents are covered, how soon the regulator must be told, what information it needs and how long the site must be left undisturbed, before this rule is verified. Until then BIZOMAT computes no deadline: check with the regulator.`;

const DEADLINE_DRAFT = 'Not verified: check the enacted law and the regulator for how soon notice must be given, and whether written notice must follow.';
const PRESERVE_DRAFT = 'Not verified: check what may and may not be disturbed at the incident site, and until when.';
const RETENTION_DRAFT = 'Not verified: check how long records of notifiable incidents must be kept.';
/** Draft criteria for a verifier to confirm: they are used only once the rule is verified. */
const DRAFT_CRITERIA = { kinds: ['dangerous_occurrence'], outcomes: ['fatality', 'hospital_inpatient'] };

interface Harmonised {
  id: string;
  code: string;
  region: string;
  name: string;
  regulator: string;
  regulatorUrl: string;
  regulatorHost: string;
  act: { title: string; url: string; host: string };
  regs: { title: string; url: string; host: string };
  sort: number;
}

const HARMONISED: Harmonised[] = [
  { id: 'au-nsw', code: 'AU-NSW', region: 'NSW', name: 'New South Wales', regulator: 'SafeWork NSW', regulatorUrl: 'https://www.safework.nsw.gov.au/', regulatorHost: 'www.safework.nsw.gov.au', act: { title: 'Work Health and Safety Act 2011 (NSW)', url: 'https://legislation.nsw.gov.au/view/html/inforce/current/act-2011-010', host: 'legislation.nsw.gov.au' }, regs: { title: 'Work Health and Safety Regulation (NSW), the regulation in force', url: 'https://legislation.nsw.gov.au/', host: 'legislation.nsw.gov.au' }, sort: 20 },
  { id: 'au-qld', code: 'AU-QLD', region: 'QLD', name: 'Queensland', regulator: 'Workplace Health and Safety Queensland', regulatorUrl: 'https://www.worksafe.qld.gov.au/', regulatorHost: 'www.worksafe.qld.gov.au', act: { title: 'Work Health and Safety Act 2011 (Qld)', url: 'https://www.legislation.qld.gov.au/view/html/inforce/current/act-2011-018', host: 'www.legislation.qld.gov.au' }, regs: { title: 'Work Health and Safety Regulation (Qld), the regulation in force', url: 'https://www.legislation.qld.gov.au/', host: 'www.legislation.qld.gov.au' }, sort: 30 },
  { id: 'au-sa', code: 'AU-SA', region: 'SA', name: 'South Australia', regulator: 'SafeWork SA', regulatorUrl: 'https://www.safework.sa.gov.au/', regulatorHost: 'www.safework.sa.gov.au', act: { title: 'Work Health and Safety Act 2012 (SA)', url: 'https://www.legislation.sa.gov.au/', host: 'www.legislation.sa.gov.au' }, regs: { title: 'Work Health and Safety Regulations (SA), the regulations in force', url: 'https://www.legislation.sa.gov.au/', host: 'www.legislation.sa.gov.au' }, sort: 40 },
  { id: 'au-tas', code: 'AU-TAS', region: 'TAS', name: 'Tasmania', regulator: 'WorkSafe Tasmania', regulatorUrl: 'https://worksafe.tas.gov.au/', regulatorHost: 'worksafe.tas.gov.au', act: { title: 'Work Health and Safety Act 2012 (Tas)', url: 'https://www.legislation.tas.gov.au/', host: 'www.legislation.tas.gov.au' }, regs: { title: 'Work Health and Safety Regulations (Tas), the regulations in force', url: 'https://www.legislation.tas.gov.au/', host: 'www.legislation.tas.gov.au' }, sort: 50 },
  { id: 'au-wa', code: 'AU-WA', region: 'WA', name: 'Western Australia', regulator: 'WorkSafe WA', regulatorUrl: 'https://www.worksafe.wa.gov.au/', regulatorHost: 'www.worksafe.wa.gov.au', act: { title: 'Work Health and Safety Act 2020 (WA)', url: 'https://www.legislation.wa.gov.au/', host: 'www.legislation.wa.gov.au' }, regs: { title: 'Work Health and Safety regulations (WA), the regulations in force for the workplace', url: 'https://www.legislation.wa.gov.au/', host: 'www.legislation.wa.gov.au' }, sort: 60 },
  { id: 'au-act', code: 'AU-ACT', region: 'ACT', name: 'Australian Capital Territory', regulator: 'WorkSafe ACT', regulatorUrl: 'https://www.worksafe.act.gov.au/', regulatorHost: 'www.worksafe.act.gov.au', act: { title: 'Work Health and Safety Act 2011 (ACT)', url: 'https://www.legislation.act.gov.au/', host: 'www.legislation.act.gov.au' }, regs: { title: 'Work Health and Safety Regulation (ACT), the regulation in force', url: 'https://www.legislation.act.gov.au/', host: 'www.legislation.act.gov.au' }, sort: 70 },
  { id: 'au-nt', code: 'AU-NT', region: 'NT', name: 'Northern Territory', regulator: 'NT WorkSafe', regulatorUrl: 'https://worksafe.nt.gov.au/', regulatorHost: 'worksafe.nt.gov.au', act: { title: 'Work Health and Safety (National Uniform Legislation) Act 2011 (NT)', url: 'https://legislation.nt.gov.au/', host: 'legislation.nt.gov.au' }, regs: { title: 'Work Health and Safety (National Uniform Legislation) Regulations (NT), the regulations in force', url: 'https://legislation.nt.gov.au/', host: 'legislation.nt.gov.au' }, sort: 80 },
];

function harmonisedPack(h: Harmonised): SeedPack {
  const act = `${h.id}.act`;
  return {
    id: h.id,
    code: h.code,
    country: 'AU',
    region: h.region,
    name: h.name,
    framework: 'Harmonised WHS laws (based on the model WHS laws)',
    regulator: h.regulator,
    regulatorUrl: h.regulatorUrl,
    assignable: true,
    coverage: 'core',
    notes: `${h.name}'s own WHS Act and regulations, based on the model WHS laws. A change to the model laws applies here only once ${h.name} enacts it: check the law in force on each incident's date.`,
    sort: h.sort,
    instruments: [
      { id: act, kind: 'legislation', title: h.act.title, url: h.act.url, industry: 'All workplaces in the jurisdiction, unless the law excludes them', check: refused(h.act.host) },
      { id: `${h.id}.regs`, kind: 'regulation', title: h.regs.title, url: h.regs.url, industry: 'All workplaces in the jurisdiction, unless the law excludes them', summary: 'Confirm which regulation is in force and its year before relying on it.', check: refused(h.regs.host) },
      { id: `${h.id}.codes`, kind: 'code_of_practice', title: `Approved codes of practice (${h.name})`, url: h.regulatorUrl, summary: 'Which model codes this jurisdiction has approved, and from when: check with the regulator.', check: refused(h.regulatorHost) },
      { id: `${h.id}.guidance`, kind: 'guidance', title: `${h.regulator}: guidance on notifying incidents`, url: h.regulatorUrl, check: refused(h.regulatorHost) },
    ],
    rules: [
      {
        key: `${h.id}.notification`,
        version: 1,
        kind: 'notification',
        title: 'Notifiable incidents',
        instrument: act,
        provision: 'Part 3 of the Act (incident notification), modelled on the model WHS Act: confirm the sections',
        url: h.act.url,
        body: NOTIFY_DRAFT(`The harmonised WHS Acts follow the model WHS Act's Part 3: a notifiable incident (a death, a serious injury or illness, or a dangerous incident) must be notified to the regulator, and the incident site preserved. The December 2025 changes to the model law apply here only once ${h.name} enacts them.`),
        criteria: DRAFT_CRITERIA,
        deadlineText: DEADLINE_DRAFT,
        requiredInfo: DRAFT_REQUIRED_INFO,
        sitePreservation: PRESERVE_DRAFT,
        responsibleParty: 'Not verified: the person conducting the business or undertaking (PCBU), under the model law. Confirm.',
        procedure: `Not verified: notify ${h.regulator} by the means it offers (its website or phone line). BIZOMAT does not submit to regulators: record the submission here once it is made.`,
        retention: RETENTION_DRAFT,
        regulator: h.regulator,
        notifyUrl: h.regulatorUrl,
        status: 'active',
        check: refused(h.act.host),
      },
      {
        key: `${h.id}.notification`,
        version: 2,
        kind: 'notification',
        title: 'Notifiable incidents: changes following the December 2025 model law amendments',
        instrument: act,
        provision: 'To be confirmed from the enacting law',
        url: h.act.url,
        body: `Draft for review. Prepare this version only once ${h.name} has enacted the changes that follow the December 2025 model law amendments, and set its effective date from the enacting law. Until it is reviewed, activated and verified, version 1 is the record shown, and old incidents keep the version that applied to them.`,
        criteria: DRAFT_CRITERIA,
        deadlineText: DEADLINE_DRAFT,
        requiredInfo: DRAFT_REQUIRED_INFO,
        sitePreservation: PRESERVE_DRAFT,
        regulator: h.regulator,
        notifyUrl: h.regulatorUrl,
        status: 'draft',
        changeNote: 'The brief says the model WHS Act now includes the December 2025 notification amendments, and that they do not apply automatically in every state or territory.',
        check: NOT_CHECKED,
      },
      {
        key: `${h.id}.exposure_limits`,
        version: 1,
        kind: 'exposure_limits',
        title: 'Workplace exposure standards (before the change to workplace exposure limits)',
        url: h.regulatorUrl,
        to: '2026-11-30',
        body: 'Draft, not verified. The earlier workplace exposure standards, until the workplace exposure limits take effect. Confirm which list applies in this jurisdiction and until when.',
        status: 'active',
        check: NOT_CHECKED,
      },
      {
        key: `${h.id}.exposure_limits`,
        version: 2,
        kind: 'exposure_limits',
        title: 'Workplace exposure limits (WEL)',
        url: h.regulatorUrl,
        from: '2026-12-01',
        body: `Draft, not verified. The brief gives 1 December 2026 as the date the workplace exposure limit amendments take effect. Confirm the commencement in ${h.name} before relying on it; this version is not applied before its effective date.`,
        status: 'active',
        changeNote: 'Configured separately so it is not applied before it commences (brief section 22).',
        check: NOT_CHECKED,
      },
      {
        key: `${h.id}.retention`,
        version: 1,
        kind: 'retention',
        title: 'Keeping records of notifiable incidents',
        instrument: `${h.id}.regs`,
        url: h.regs.url,
        body: `Draft, not verified. ${RETENTION_DRAFT}`,
        retention: RETENTION_DRAFT,
        status: 'active',
        check: refused(h.regs.host),
      },
    ],
  };
}

const skeletonRule = (pack: string, title: string, url: string, host: string, regulator: string, law: string): SeedRule => ({
  key: `${pack}.notification`,
  version: 1,
  kind: 'notification',
  title,
  instrument: `${pack}.act`,
  provision: 'To be confirmed',
  url,
  body: NOTIFY_DRAFT(law),
  criteria: DRAFT_CRITERIA,
  deadlineText: DEADLINE_DRAFT,
  requiredInfo: DRAFT_REQUIRED_INFO,
  sitePreservation: PRESERVE_DRAFT,
  regulator,
  notifyUrl: url,
  status: 'active',
  check: refused(host),
});

export const SEED_PACKS: SeedPack[] = [
  {
    id: 'au-model',
    code: 'AU-MODEL',
    country: 'AU',
    region: '',
    name: 'Model WHS laws (Safe Work Australia)',
    framework: 'Model WHS laws: a model for the Commonwealth, states and territories to adopt',
    regulator: 'Safe Work Australia develops the model laws; it does not enforce them',
    regulatorUrl: 'https://www.safeworkaustralia.gov.au/law-and-regulation',
    assignable: false,
    coverage: 'reference',
    notes: 'A reference, not a jurisdiction: it applies to no site. Each jurisdiction enacts its own laws, which may differ from the model or lag behind it.',
    sort: 0,
    instruments: [
      { id: 'au-model.law', kind: 'guidance', title: 'Law and regulation (Safe Work Australia)', url: 'https://www.safeworkaustralia.gov.au/law-and-regulation', check: refused('www.safeworkaustralia.gov.au') },
      { id: 'au-model.laws', kind: 'model_law', title: 'Model WHS laws', url: 'https://www.safeworkaustralia.gov.au/law-and-regulation/model-whs-laws', check: refused('www.safeworkaustralia.gov.au') },
      { id: 'au-model.act', kind: 'model_law', title: 'Model Work Health and Safety Act', url: 'https://www.safeworkaustralia.gov.au/doc/model-work-health-and-safety-act', summary: 'The brief says the current model Act includes incident notification amendments made in December 2025. They apply in a jurisdiction only once it enacts them.', check: refused('www.safeworkaustralia.gov.au') },
      { id: 'au-model.regs', kind: 'model_law', title: 'Model WHS Regulations', url: 'https://www.safeworkaustralia.gov.au/doc/model-whs-regulations', summary: 'The brief says the Model WHS Regulations 2025 include updated provisions, and that the workplace exposure limit amendments take effect on 1 December 2026.', check: refused('www.safeworkaustralia.gov.au') },
      { id: 'au-model.codes', kind: 'model_law', title: 'Model codes of practice', url: 'https://www.safeworkaustralia.gov.au/law-and-regulation/codes-practice', summary: 'A model code becomes an approved code of practice only where a jurisdiction approves it.', check: refused('www.safeworkaustralia.gov.au') },
      { id: 'au-model.dewr', kind: 'guidance', title: 'Work health and safety (Department of Employment and Workplace Relations)', url: 'https://www.dewr.gov.au/work-health-and-safety', check: refused('www.dewr.gov.au') },
    ],
    rules: [
      {
        key: 'au-model.notification-2025',
        version: 1,
        kind: 'notification',
        title: 'Model WHS Act: incident notification amendments (December 2025)',
        instrument: 'au-model.act',
        url: 'https://www.safeworkaustralia.gov.au/doc/model-work-health-and-safety-act',
        body: 'Draft, not verified. The brief for this release says the current model WHS Act includes incident notification amendments made in December 2025. A model law is not in force by itself: each jurisdiction decides whether and when to enact a change, so this record applies to no site. Each harmonised jurisdiction has a draft version waiting for its own enacting law.',
        status: 'active',
        check: refused('www.safeworkaustralia.gov.au'),
      },
      {
        key: 'au-model.exposure_limits',
        version: 1,
        kind: 'exposure_limits',
        title: 'Workplace exposure limits (model)',
        instrument: 'au-model.regs',
        url: 'https://www.safeworkaustralia.gov.au/doc/model-whs-regulations',
        from: '2026-12-01',
        body: 'Draft, not verified. The brief gives 1 December 2026 as the effective date of the workplace exposure limit amendments. Each jurisdiction has its own record of when they apply there.',
        status: 'active',
        check: refused('www.safeworkaustralia.gov.au'),
      },
    ],
  },
  {
    id: 'au-cth',
    code: 'AU-CTH',
    country: 'AU',
    region: 'CTH',
    name: 'Commonwealth (Comcare)',
    framework: 'Harmonised WHS laws: the Commonwealth WHS Act and Regulations',
    regulator: 'Comcare',
    regulatorUrl: 'https://www.comcare.gov.au/',
    assignable: true,
    coverage: 'core',
    notes: 'For workplaces covered by the Commonwealth WHS laws (Comcare’s jurisdiction). Confirm the workplace is covered before choosing it for a site.',
    sort: 10,
    instruments: [
      { id: 'au-cth.act', kind: 'legislation', title: 'Work Health and Safety Act 2011 (Cth)', citation: 'C2011A00137', url: 'https://www.legislation.gov.au/C2011A00137/latest/text', amendedAt: '2024-07-01', industry: 'Workplaces covered by the Commonwealth WHS laws (confirm coverage)', summary: 'Part 3 is incident notification (sections 35 to 39, from the register’s table of contents).', check: CTH_ACT_CHECK },
      { id: 'au-cth.regs', kind: 'regulation', title: 'Work Health and Safety Regulations 2011 (Cth)', citation: 'F2011L02664', url: 'https://www.legislation.gov.au/F2011L02664/latest/text', amendedAt: '2025-03-25', industry: 'Workplaces covered by the Commonwealth WHS laws (confirm coverage)', check: CTH_REGS_CHECK },
      { id: 'au-cth.guidance', kind: 'guidance', title: 'Comcare: notifying incidents', url: 'https://www.comcare.gov.au/', check: refused('www.comcare.gov.au') },
    ],
    rules: [
      {
        key: 'au-cth.notification',
        version: 1,
        kind: 'notification',
        title: 'Notifiable incidents (Commonwealth)',
        instrument: 'au-cth.act',
        provision: 'Work Health and Safety Act 2011 (Cth), Part 3, sections 35 to 39 (headings read from the Federal Register of Legislation on 15 Nov 2026)',
        url: 'https://www.legislation.gov.au/C2011A00137/latest/text',
        body: NOTIFY_DRAFT('Part 3 of the Act, Incident notification, covers what a notifiable incident is, what a serious injury or illness is, what a dangerous incident is, the duty to notify the regulator and the duty to preserve incident sites (the section headings; their text was not read).'),
        criteria: DRAFT_CRITERIA,
        deadlineText: DEADLINE_DRAFT,
        requiredInfo: DRAFT_REQUIRED_INFO,
        sitePreservation: 'Not verified: the Act has a duty to preserve incident sites (section 39’s heading). Check what may be disturbed, and until when.',
        responsibleParty: 'Not verified: the person conducting the business or undertaking (PCBU). Confirm from section 38.',
        procedure: 'Not verified: notify Comcare by the means it offers. BIZOMAT does not submit to regulators: record the submission here once it is made.',
        retention: RETENTION_DRAFT,
        regulator: 'Comcare',
        notifyUrl: 'https://www.comcare.gov.au/',
        status: 'active',
        check: CTH_ACT_CHECK,
      },
      {
        key: 'au-cth.notification',
        version: 2,
        kind: 'notification',
        title: 'Notifiable incidents (Commonwealth): changes following the December 2025 model law amendments',
        instrument: 'au-cth.act',
        provision: 'To be confirmed from the enacting law',
        url: 'https://www.legislation.gov.au/C2011A00137/latest/text',
        body: 'Draft for review. On 15 Nov 2026 the register’s latest compilation of the Act was in force from 1 July 2024, so a later amending Act, if any, was not compiled into it. Prepare this version only from the enacting law, with its effective date.',
        criteria: DRAFT_CRITERIA,
        deadlineText: DEADLINE_DRAFT,
        requiredInfo: DRAFT_REQUIRED_INFO,
        regulator: 'Comcare',
        notifyUrl: 'https://www.comcare.gov.au/',
        status: 'draft',
        changeNote: 'The brief says the model WHS Act now includes the December 2025 notification amendments, and that they do not apply automatically in every jurisdiction.',
        check: CTH_ACT_CHECK,
      },
      {
        key: 'au-cth.retention',
        version: 1,
        kind: 'retention',
        title: 'Keeping records of notifiable incidents (Commonwealth)',
        instrument: 'au-cth.regs',
        url: 'https://www.legislation.gov.au/F2011L02664/latest/text',
        body: `Draft, not verified. ${RETENTION_DRAFT}`,
        retention: RETENTION_DRAFT,
        status: 'active',
        check: CTH_REGS_CHECK,
      },
    ],
  },
  ...HARMONISED.map(harmonisedPack),
  {
    id: 'au-vic',
    code: 'AU-VIC',
    country: 'AU',
    region: 'VIC',
    name: 'Victoria',
    framework: 'Victorian occupational health and safety laws (not the harmonised WHS laws)',
    regulator: 'WorkSafe Victoria',
    regulatorUrl: 'https://www.worksafe.vic.gov.au/',
    assignable: true,
    coverage: 'core',
    notes: 'Victoria has its own framework under the Occupational Health and Safety Act 2004. The harmonised WHS rules of the other jurisdictions never apply here.',
    sort: 90,
    instruments: [
      { id: 'au-vic.act', kind: 'legislation', title: 'Occupational Health and Safety Act 2004 (Vic)', url: 'https://www.legislation.vic.gov.au/in-force/acts/occupational-health-and-safety-act-2004', industry: 'All workplaces in Victoria, unless the law excludes them', check: refused('www.legislation.vic.gov.au') },
      { id: 'au-vic.regs', kind: 'regulation', title: 'Occupational Health and Safety Regulations (Vic), the regulations in force', url: 'https://www.legislation.vic.gov.au/', summary: 'Confirm which regulations are in force and their year.', check: refused('www.legislation.vic.gov.au') },
      { id: 'au-vic.codes', kind: 'guidance', title: 'Compliance codes and guidance (WorkSafe Victoria)', url: 'https://www.worksafe.vic.gov.au/', summary: 'Victoria uses compliance codes: check their legal status under the OHS Act.', check: refused('www.worksafe.vic.gov.au') },
    ],
    rules: [
      {
        key: 'au-vic.notification',
        version: 1,
        kind: 'notification',
        title: 'Incident notification under Victoria’s OHS Act',
        instrument: 'au-vic.act',
        provision: 'Occupational Health and Safety Act 2004 (Vic): confirm the provisions',
        url: 'https://www.legislation.vic.gov.au/in-force/acts/occupational-health-and-safety-act-2004',
        body: NOTIFY_DRAFT('Victoria has its own incident notification provisions in the OHS Act 2004; they are not the harmonised WHS Act’s, and the model law’s changes do not apply here.'),
        criteria: DRAFT_CRITERIA,
        deadlineText: DEADLINE_DRAFT,
        requiredInfo: DRAFT_REQUIRED_INFO,
        sitePreservation: PRESERVE_DRAFT,
        procedure: 'Not verified: notify WorkSafe Victoria by the means it offers. BIZOMAT does not submit to regulators: record the submission here once it is made.',
        retention: RETENTION_DRAFT,
        regulator: 'WorkSafe Victoria',
        notifyUrl: 'https://www.worksafe.vic.gov.au/',
        status: 'active',
        check: refused('www.legislation.vic.gov.au'),
      },
    ],
  },
  {
    id: 'nz',
    code: 'NZ',
    country: 'NZ',
    region: '',
    name: 'New Zealand',
    framework: 'Health and Safety at Work Act 2015',
    regulator: 'WorkSafe New Zealand',
    regulatorUrl: 'https://www.worksafe.govt.nz/',
    assignable: true,
    coverage: 'skeleton',
    notes: 'Skeleton pack: the regulator and the primary legislation. Notifiable events, worker engagement and participation, and the regulations are to be added and verified.',
    sort: 100,
    instruments: [
      { id: 'nz.act', kind: 'legislation', title: 'Health and Safety at Work Act 2015', url: 'https://www.legislation.govt.nz/act/public/2015/0070/latest/whole.html', check: refused('www.legislation.govt.nz') },
      { id: 'nz.guidance', kind: 'guidance', title: 'WorkSafe New Zealand guidance', url: 'https://www.worksafe.govt.nz/', check: refused('www.worksafe.govt.nz') },
    ],
    rules: [skeletonRule('nz', 'Notifiable events', 'https://www.legislation.govt.nz/act/public/2015/0070/latest/whole.html', 'www.legislation.govt.nz', 'WorkSafe New Zealand', 'New Zealand’s Act speaks of notifiable events, with its own definitions; they are not Australia’s notifiable incidents.')],
  },
  {
    id: 'uk-gb',
    code: 'UK-GB',
    country: 'GB',
    region: 'GB',
    name: 'United Kingdom: Great Britain',
    framework: 'Health and Safety at Work etc. Act 1974 and its regulations',
    regulator: 'Health and Safety Executive (HSE)',
    regulatorUrl: 'https://www.hse.gov.uk/',
    assignable: true,
    coverage: 'skeleton',
    notes: 'Skeleton pack for England, Scotland and Wales. Northern Ireland has its own legislation and regulator and would need its own pack.',
    sort: 110,
    instruments: [
      { id: 'uk-gb.act', kind: 'legislation', title: 'Health and Safety at Work etc. Act 1974', url: 'https://www.legislation.gov.uk/ukpga/1974/37', check: refused('www.legislation.gov.uk') },
      { id: 'uk-gb.mhswr', kind: 'regulation', title: 'Management of Health and Safety at Work Regulations 1999', url: 'https://www.legislation.gov.uk/uksi/1999/3242', check: refused('www.legislation.gov.uk') },
      { id: 'uk-gb.riddor', kind: 'regulation', title: 'Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013 (RIDDOR)', url: 'https://www.legislation.gov.uk/uksi/2013/1471', check: refused('www.legislation.gov.uk') },
      { id: 'uk-gb.coshh', kind: 'regulation', title: 'Control of Substances Hazardous to Health Regulations 2002 (COSHH)', url: 'https://www.legislation.gov.uk/uksi/2002/2677', check: refused('www.legislation.gov.uk') },
      { id: 'uk-gb.puwer', kind: 'regulation', title: 'Provision and Use of Work Equipment Regulations 1998 (PUWER)', url: 'https://www.legislation.gov.uk/uksi/1998/2306', check: refused('www.legislation.gov.uk') },
      { id: 'uk-gb.loler', kind: 'regulation', title: 'Lifting Operations and Lifting Equipment Regulations 1998 (LOLER)', url: 'https://www.legislation.gov.uk/uksi/1998/2307', check: refused('www.legislation.gov.uk') },
      { id: 'uk-gb.hse', kind: 'guidance', title: 'HSE guidance and approved codes of practice', url: 'https://www.hse.gov.uk/', summary: 'Approved codes of practice have their own legal standing in Great Britain: check each one.', check: refused('www.hse.gov.uk') },
    ],
    rules: [{ ...skeletonRule('uk-gb', 'Reporting under RIDDOR', 'https://www.legislation.gov.uk/uksi/2013/1471', 'www.legislation.gov.uk', 'Health and Safety Executive (HSE)', 'Great Britain reports injuries, diseases and dangerous occurrences under RIDDOR, with its own categories and deadlines.'), instrument: 'uk-gb.riddor' }],
  },
  {
    id: 'ca-federal',
    code: 'CA-FED',
    country: 'CA',
    region: 'FED',
    name: 'Canada: federal jurisdiction',
    framework: 'Canada Labour Code, Part II',
    regulator: 'Labour Program, Employment and Social Development Canada',
    regulatorUrl: 'https://www.canada.ca/en/employment-social-development/programs/health-safety.html',
    assignable: true,
    coverage: 'skeleton',
    notes: 'Skeleton pack for federally regulated workplaces only. Most workplaces in Canada are under a province or territory, each with its own pack: Canada is not one uniform framework.',
    sort: 120,
    instruments: [
      { id: 'ca-federal.act', kind: 'legislation', title: 'Canada Labour Code, Part II (Occupational Health and Safety)', url: 'https://laws-lois.justice.gc.ca/eng/acts/L-2/', check: refused('laws-lois.justice.gc.ca') },
      { id: 'ca-federal.regs', kind: 'regulation', title: 'Canada Occupational Health and Safety Regulations', url: 'https://laws-lois.justice.gc.ca/eng/regulations/SOR-86-304/', check: refused('laws-lois.justice.gc.ca') },
    ],
    rules: [skeletonRule('ca-federal', 'Hazardous occurrence reporting (federal)', 'https://laws-lois.justice.gc.ca/eng/acts/L-2/', 'laws-lois.justice.gc.ca', 'Labour Program, Employment and Social Development Canada', 'Federally regulated workplaces report hazardous occurrences under the Canada Labour Code and its regulations.')],
  },
  {
    id: 'ca-on',
    code: 'CA-ON',
    country: 'CA',
    region: 'ON',
    name: 'Canada: Ontario',
    framework: 'Occupational Health and Safety Act (Ontario)',
    regulator: 'Ontario Ministry of Labour',
    regulatorUrl: 'https://www.ontario.ca/laws/statute/90o01',
    assignable: true,
    coverage: 'skeleton',
    notes: 'Skeleton pack: the province’s primary legislation and regulator. Check the ministry’s current name and the reporting requirements.',
    sort: 121,
    instruments: [{ id: 'ca-on.act', kind: 'legislation', title: 'Occupational Health and Safety Act (Ontario)', url: 'https://www.ontario.ca/laws/statute/90o01', check: refused('www.ontario.ca') }],
    rules: [],
  },
  {
    id: 'ca-bc',
    code: 'CA-BC',
    country: 'CA',
    region: 'BC',
    name: 'Canada: British Columbia',
    framework: 'Workers Compensation Act and Occupational Health and Safety Regulation (British Columbia)',
    regulator: 'WorkSafeBC',
    regulatorUrl: 'https://www.worksafebc.com/',
    assignable: true,
    coverage: 'skeleton',
    notes: 'Skeleton pack: the province’s primary legislation and regulator.',
    sort: 122,
    instruments: [{ id: 'ca-bc.act', kind: 'legislation', title: 'Workers Compensation Act (British Columbia)', url: 'https://www.bclaws.gov.bc.ca/', check: refused('www.bclaws.gov.bc.ca') }],
    rules: [],
  },
  {
    id: 'ca-ab',
    code: 'CA-AB',
    country: 'CA',
    region: 'AB',
    name: 'Canada: Alberta',
    framework: 'Occupational Health and Safety Act (Alberta)',
    regulator: 'Alberta Occupational Health and Safety',
    regulatorUrl: 'https://www.alberta.ca/occupational-health-safety',
    assignable: true,
    coverage: 'skeleton',
    notes: 'Skeleton pack: the province’s primary legislation and regulator.',
    sort: 123,
    instruments: [{ id: 'ca-ab.act', kind: 'legislation', title: 'Occupational Health and Safety Act (Alberta)', url: 'https://www.alberta.ca/occupational-health-safety', check: refused('www.alberta.ca') }],
    rules: [],
  },
  {
    id: 'ca-qc',
    code: 'CA-QC',
    country: 'CA',
    region: 'QC',
    name: 'Canada: Québec',
    framework: 'Act respecting occupational health and safety (Québec)',
    regulator: 'CNESST',
    regulatorUrl: 'https://www.cnesst.gouv.qc.ca/',
    assignable: true,
    coverage: 'skeleton',
    notes: 'Skeleton pack: the province’s primary legislation and regulator.',
    sort: 124,
    instruments: [{ id: 'ca-qc.act', kind: 'legislation', title: 'Act respecting occupational health and safety (Québec)', url: 'https://www.legisquebec.gouv.qc.ca/', check: refused('www.legisquebec.gouv.qc.ca') }],
    rules: [],
  },
  {
    id: 'sg',
    code: 'SG',
    country: 'SG',
    region: '',
    name: 'Singapore',
    framework: 'Workplace Safety and Health Act',
    regulator: 'Ministry of Manpower',
    regulatorUrl: 'https://www.mom.gov.sg/workplace-safety-and-health',
    assignable: true,
    coverage: 'skeleton',
    notes: 'Skeleton pack: the Act, the Risk Management Regulations and the regulator. Safety and health management system requirements are to be added and verified.',
    sort: 130,
    instruments: [
      { id: 'sg.act', kind: 'legislation', title: 'Workplace Safety and Health Act 2006', url: 'https://sso.agc.gov.sg/Act/WSHA2006', check: refused('sso.agc.gov.sg') },
      { id: 'sg.rm', kind: 'regulation', title: 'Workplace Safety and Health (Risk Management) Regulations', url: 'https://sso.agc.gov.sg/Act/WSHA2006', summary: 'Confirm the regulations’ citation and current version.', check: refused('sso.agc.gov.sg') },
      { id: 'sg.guidance', kind: 'guidance', title: 'Ministry of Manpower: workplace safety and health', url: 'https://www.mom.gov.sg/workplace-safety-and-health', check: refused('www.mom.gov.sg') },
    ],
    rules: [skeletonRule('sg', 'Incident reporting (Singapore)', 'https://www.mom.gov.sg/workplace-safety-and-health', 'www.mom.gov.sg', 'Ministry of Manpower', 'Singapore has its own incident reporting requirements under its workplace safety and health law.')],
  },
  {
    id: 'za',
    code: 'ZA',
    country: 'ZA',
    region: '',
    name: 'South Africa',
    framework: 'Occupational Health and Safety Act 85 of 1993',
    regulator: 'Department of Employment and Labour',
    regulatorUrl: 'https://www.labour.gov.za/',
    assignable: true,
    coverage: 'skeleton',
    notes: 'Skeleton pack: the Act and the regulator. The regulations, incident reporting and the required risk assessments are to be added and verified.',
    sort: 140,
    instruments: [
      { id: 'za.act', kind: 'legislation', title: 'Occupational Health and Safety Act 85 of 1993', url: 'https://www.gov.za/documents/occupational-health-and-safety-act', check: refused('www.gov.za') },
      { id: 'za.guidance', kind: 'guidance', title: 'Department of Employment and Labour', url: 'https://www.labour.gov.za/', check: refused('www.labour.gov.za') },
    ],
    rules: [skeletonRule('za', 'Incident reporting (South Africa)', 'https://www.gov.za/documents/occupational-health-and-safety-act', 'www.gov.za', 'Department of Employment and Labour', 'South Africa has its own incident reporting requirements under the OHS Act 85 of 1993 and its regulations.')],
  },
];
