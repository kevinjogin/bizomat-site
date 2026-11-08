// Contact enquiry contract shared by the browser form, the assistant's "Leave a message"
// form and the Cloudflare function. Keep this file dependency-free so it runs in the browser,
// Workers and Node tests alike.

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 200 },
  company: { max: 150 },
  phone: { max: 40 },
  service: { max: 60 },
  website: { max: 200 },
  resource: { max: 150 },
  message: { min: 20, max: 5000 },
} as const;

/**
 * Enquiry categories (the `service` field). Each slug can be preselected with /contact/?service=<slug>.
 * Engineering and technical projects keep the service values in SERVICE_OPTIONS (src/data/services.ts), so existing
 * ?service= links from the services, Factory Fix and Engine Room (case-study) pages still preselect.
 */
export const ENQUIRY_CATEGORIES = [
  { value: 'General enquiry', slug: 'general' },
  { value: 'CAD Automation', slug: 'cad-automation' },
  { value: 'Project Management', slug: 'project-management' },
  { value: 'Ideas and feedback', slug: 'feedback' },
  { value: 'Collaboration and partnerships', slug: 'collaboration' },
] as const;
export const ENGINEERING_PROJECT = { value: 'Engineering or technical project', slug: 'engineering-project' } as const;

/** Values for the former "Service required" field. Keep in step with SERVICE_OPTIONS in src/data/services.ts. */
export const SERVICES = [
  'Engineering / CAD',
  'Manufacturing Support',
  'Operations Improvement',
  'Project Support',
  'Factory Fix',
  'Ongoing Support',
  'Other',
] as const;

export const CONTACT_METHODS = ['Email', 'Phone', 'Either'] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

/** Hidden field that people never see; bots tend to fill it. */
export const HONEYPOT_FIELD = 'botcheck'; // Web3Forms' own honeypot name; the Worker checks it too.

export interface ContactInput {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  /** Optional website of the visitor or their organisation. */
  website: string;
  /** Optional product, feature or case study the enquiry is about. */
  resource: string;
  message: string;
  contactMethod: ContactMethod;
  consent: boolean;
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

/** Wire format of the endpoint's JSON response. The UI depends only on this shape. */
export interface ContactResponse {
  ok: boolean;
  /** Human-readable message suitable for display. */
  message?: string;
  /** Field-level validation errors, keyed by field name. */
  errors?: ContactErrors;
}

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const PHONE = /^[+()0-9\s.-]+$/;
const WEBSITE = /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+(:\d{1,5})?([/?#]\S*)?$/i;
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export const clean = (value: unknown, max: number) => String(value ?? '').replace(CONTROL, '').trim().slice(0, max);

export function normalise(data: Record<string, unknown>): ContactInput {
  const method = clean(data.contactMethod, 10);
  return {
    name: clean(data.name, CONTACT_LIMITS.name.max),
    email: clean(data.email, CONTACT_LIMITS.email.max).toLowerCase(),
    // `organisation` and `subject` are accepted for compatibility with older form posts.
    company: clean(data.company ?? data.organisation, CONTACT_LIMITS.company.max),
    phone: clean(data.phone, CONTACT_LIMITS.phone.max),
    service: clean(data.service ?? data.subject, CONTACT_LIMITS.service.max),
    website: clean(data.website, CONTACT_LIMITS.website.max),
    resource: clean(data.resource, CONTACT_LIMITS.resource.max),
    message: clean(data.message, CONTACT_LIMITS.message.max),
    contactMethod: (CONTACT_METHODS as readonly string[]).includes(method) ? (method as ContactMethod) : 'Email',
    consent: data.consent === true || data.consent === 'on' || data.consent === 'true',
  };
}

export interface ValidateOptions {
  /** Ask for a company. REACHOS and the assistant's quick message form both treat it as optional. */
  requireCompany?: boolean;
}

export function validate(input: ContactInput, { requireCompany = false }: ValidateOptions = {}): ContactErrors {
  const errors: ContactErrors = {};
  if (input.name.length < CONTACT_LIMITS.name.min) errors.name = 'Please enter your name.';
  if (requireCompany && !input.company) errors.company = 'Please enter your company name (or “Private” if not applicable).';
  if (!EMAIL.test(input.email)) errors.email = 'Please enter a valid email address, for example name@example.com.';
  if (input.phone && (!PHONE.test(input.phone) || input.phone.replace(/\D/g, '').length < 8)) {
    errors.phone = 'Please enter a valid phone number, or leave it blank.';
  } else if (input.contactMethod === 'Phone' && !input.phone) {
    errors.phone = 'Please add a phone number, or choose email as your preferred contact method.';
  }
  if (input.website && !WEBSITE.test(input.website)) errors.website = 'Please enter a website address such as example.com, or leave it blank.';
  if (!input.service) errors.service = 'Please choose an enquiry category, or “Other”.';
  if (input.message.length < CONTACT_LIMITS.message.min)
    errors.message = `Please tell us a little more about your enquiry (at least ${CONTACT_LIMITS.message.min} characters).`;
  else if ((input.message.match(/https?:\/\//gi) ?? []).length > 3) errors.message = 'Please include no more than three links.';
  if (!input.consent) errors.consent = 'Please confirm you have read the privacy notice.';
  return errors;
}

/** One-line summary used as the email subject. */
export const enquirySubject = (input: ContactInput) =>
  `BIZOMAT enquiry: ${input.service || 'General'} — ${input.company || input.name}`.replace(/[\r\n]+/g, ' ').slice(0, 200);
