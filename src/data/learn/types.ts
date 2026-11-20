// The BIZOMAT ERP Knowledge Centre's content model (owner's brief of 20 Nov 2026: one searchable, organised place to
// learn the ERP). Every guide and workflow is typed data in src/data/learn/; the pages under /learn/ render it, the
// search index is built from it, and tests/learn.test.ts checks it (every guide complete, every link real, every status
// honest). Content describes only what the code does today: a feature that is not built carries status 'planned' or
// 'in-development' and is never written up as a working tutorial.
import type { FeatureStatus } from '../../config/systems.ts';

export type { FeatureStatus };

/** The sections of the Knowledge Centre, in the order the hub shows them. */
export const SECTIONS = [
  { id: 'getting-started', title: 'Getting started', lead: 'What BIZOMAT is, your account, finding your way around, your company and who can do what.' },
  { id: 'modules', title: 'ERP modules', lead: 'Every module of BIZOMAT ERP: what it is for, how to use it, its buttons and its common questions.' },
  { id: 'workflows', title: 'Workflows', lead: 'End-to-end processes that run across modules, from the first record to the last.' },
  { id: 'ai', title: 'AI, automation and integrations', lead: 'AI Search and the Assistant, automations, the API, connected AI apps and how the tools link together.' },
  { id: 'cad', title: 'CAD and engineering', lead: 'CAD Automation: an AI assistant working in SOLIDWORKS on your own computer, set up, used and fixed.' },
  { id: 'admin', title: 'Administrator guide', lead: 'Running a company in BIZOMAT: people, roles, departments, security, data and settings.' },
  { id: 'troubleshooting', title: 'Troubleshooting', lead: 'When something does not work: sign-in, permissions, missing modules, data, forms, approvals and connections.' },
] as const;
export type SectionId = (typeof SECTIONS)[number]['id'];

/** A step of a tutorial. `where` names the screen element, in the application's own words, for the illustration. */
export interface Step {
  title: string;
  body: string;
  /** Optional: what to look for on the screen (a button, tab or field label exactly as the application shows it). */
  where?: string;
}

/** A step-by-step tutorial (E). Tutorials never change records by themselves: they describe what the person does. */
export interface Tutorial {
  id: string;
  title: string;
  /** One sentence: what you will have done at the end. */
  outcome: string;
  /** Who may do it, when that matters (a role or right). */
  needs?: string;
  steps: Step[];
  /** What happens next, after the last step. */
  after?: string;
}

/** An important button or control (F): what it does, when to use it and what happens afterwards. */
export interface ButtonHelp {
  label: string;
  does: string;
  when?: string;
  after?: string;
}

/** A question and its answer (G). Plain text; links are written as the page path in brackets, e.g. (/learn/crm/). */
export interface Faq {
  q: string;
  a: string;
}

/** A guide: one module, feature or topic, with the documentation structure A to J where it applies. */
export interface Guide {
  id: string;
  section: SectionId;
  /** The name as the application shows it (the module rail's label, where it has one). */
  title: string;
  /** Short name for cards and the search. */
  short?: string;
  status: FeatureStatus;
  /** A. What is this? One or two plain sentences. */
  what: string;
  /** B. What is it used for? */
  purpose: string[];
  /** C. Who should use it? */
  who: string[];
  /** D. How do I access it? The navigation path, in the application's own words. */
  access?: { path: string[]; href: string; label: string; note?: string };
  /** E. Step-by-step tutorials (the first one is shown first). */
  tutorials: Tutorial[];
  /** F. The important buttons. */
  buttons?: ButtonHelp[];
  /** G. Common problems and questions. */
  faqs: Faq[];
  /** H. Related modules (guide ids) and, where there is one, the chain of modules a record moves through. */
  related: string[];
  chain?: string[];
  /** I. Related workflows (workflow ids). */
  workflows?: string[];
  /** What is not available yet, said plainly (each with its status). */
  notYet?: { text: string; status: Exclude<FeatureStatus, 'live' | 'connected'> }[];
  /** Search words people use that the text may not contain (synonyms). */
  keywords?: string[];
  /** Where the facts were read, for whoever checks or updates the guide. */
  sources: string[];
  /** When the guide was last checked against the application (YYYY-MM-DD). */
  updated: string;
}

/** A stage of a workflow: a module and what happens there. */
export interface Stage {
  guide: string;
  label: string;
  detail: string;
}

/** An end-to-end workflow across modules. */
export interface Workflow {
  id: string;
  title: string;
  status: FeatureStatus;
  /** What the workflow achieves, in one or two sentences. */
  summary: string;
  stages: Stage[];
  /** The step-by-step walk through it. */
  tutorial: Tutorial;
  faqs: Faq[];
  keywords?: string[];
  sources: string[];
  updated: string;
}
