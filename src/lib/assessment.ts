// Engineering Problem Assessment enquiry contract, shared by the browser form, the Worker endpoint
// (/api/assessment) and the Node tests. Dependency-free so it runs everywhere.
import { MATERIALS, PROBLEM_CATEGORIES, STATES } from '../config/assessment.ts';
import { CONTACT_METHODS, clean, type ContactMethod } from './contact.ts';

export const ASSESSMENT_LIMITS = {
  name: { min: 2, max: 100 },
  company: { max: 150 },
  email: { max: 200 },
  phone: { max: 40 },
  industry: { max: 100 },
  description: { min: 40, max: 3000 },
  impact: { min: 10, max: 1500 },
  outcome: { min: 10, max: 1500 },
} as const;

export interface AssessmentInput {
  name: string;
  company: string;
  email: string;
  phone: string;
  state: string;
  industry: string;
  category: string;
  description: string;
  impact: string;
  outcome: string;
  materials: string[];
  contactMethod: ContactMethod;
  consent: boolean;
}

export type AssessmentErrors = Partial<Record<keyof AssessmentInput, string>>;

export interface AssessmentResponse {
  ok: boolean;
  message?: string;
  errors?: AssessmentErrors;
}

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const PHONE = /^[+()0-9\s.-]+$/;
const LINKS = /https?:\/\//gi;
const L = ASSESSMENT_LIMITS;

const list = (value: unknown): string[] => {
  const raw = Array.isArray(value) ? value : String(value ?? '').split(/\s*[,;]\s*/);
  return raw.map((v) => clean(v, 40)).filter((v) => (MATERIALS as readonly string[]).includes(v));
};

/** Accepts a plain object (from FormData, JSON or tests). `materials` may be an array or a comma-separated string. */
export function normaliseAssessment(data: Record<string, unknown>): AssessmentInput {
  const method = clean(data.contactMethod, 10);
  return {
    name: clean(data.name, L.name.max),
    company: clean(data.company, L.company.max),
    email: clean(data.email, L.email.max).toLowerCase(),
    phone: clean(data.phone, L.phone.max),
    state: clean(data.state, 10).toUpperCase(),
    industry: clean(data.industry, L.industry.max),
    category: clean(data.category, 40),
    description: clean(data.description, L.description.max),
    impact: clean(data.impact, L.impact.max),
    outcome: clean(data.outcome, L.outcome.max),
    materials: [...new Set(list(data.materials))],
    contactMethod: (CONTACT_METHODS as readonly string[]).includes(method) ? (method as ContactMethod) : 'Email',
    consent: data.consent === true || data.consent === 'on' || data.consent === 'true',
  };
}

export function validateAssessment(input: AssessmentInput): AssessmentErrors {
  const e: AssessmentErrors = {};
  if (input.name.length < L.name.min) e.name = 'Please enter your full name.';
  if (!input.company) e.company = 'Please enter your company name.';
  if (!EMAIL.test(input.email)) e.email = 'Please enter a valid business email address, for example name@company.com.au.';
  if (input.phone && (!PHONE.test(input.phone) || input.phone.replace(/\D/g, '').length < 8)) e.phone = 'Please enter a valid phone number, or leave it blank.';
  else if (input.contactMethod === 'Phone' && !input.phone) e.phone = 'Please add a phone number, or choose email as your preferred contact method.';
  if (!(STATES as readonly string[]).includes(input.state)) e.state = 'Please choose your state or territory.';
  if (!(PROBLEM_CATEGORIES as readonly string[]).includes(input.category)) e.category = 'Please choose the category closest to your problem, or “Other”.';
  if (input.description.length < L.description.min)
    e.description = `Please describe the problem in a little more detail (at least ${L.description.min} characters).`;
  else if ((input.description.match(LINKS) ?? []).length > 3) e.description = 'Please include no more than three links.';
  if (input.impact.length < L.impact.min) e.impact = 'Please describe the current issue or its impact.';
  if (input.outcome.length < L.outcome.min) e.outcome = 'Please describe the outcome you would like.';
  if (!input.materials.length) e.materials = 'Please choose what you could share, or “Nothing yet”.';
  if (!input.consent) e.consent = 'Please confirm you have read the assessment terms and the privacy policy.';
  return e;
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();

/** Email subject for BIZOMAT's inbox. */
export const assessmentSubject = (i: AssessmentInput) =>
  oneLine(`BIZOMAT assessment enquiry: ${i.category || 'Other'} — ${i.company || i.name}`).slice(0, 200);

/** Ordered label/value rows, used for the email body and any provider that needs flat fields. */
export function assessmentRows(i: AssessmentInput): Array<[string, string]> {
  return [
    ['Service', 'Engineering Problem Assessment (A$195)'],
    ['Status', 'NEW'],
    ['Full name', i.name],
    ['Company', i.company],
    ['Business email', i.email],
    ['Phone', i.phone || '—'],
    ['State or territory', i.state],
    ['Industry', i.industry || '—'],
    ['Problem category', i.category],
    ['Information available', i.materials.join(', ')],
    ['Preferred contact', i.contactMethod],
    ['Terms and privacy acknowledged', i.consent ? 'Yes' : 'No'],
  ];
}

export function composeAssessment(i: AssessmentInput) {
  const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
  const blocks: Array<[string, string]> = [
    ['Description of the problem', i.description],
    ['Current issue or impact', i.impact],
    ['Desired outcome', i.outcome],
  ];
  const rows = assessmentRows(i);
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${blocks.map(([k, v]) => `${k}:\n${v}`).join('\n\n')}\n`;
  const html =
    `<p>${rows.map(([k, v]) => `<strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}`).join('<br>')}</p>` +
    blocks.map(([k, v]) => `<h3>${escapeHtml(k)}</h3><p>${escapeHtml(v).replace(/\n/g, '<br>')}</p>`).join('');
  return { subject: assessmentSubject(i), text, html };
}
