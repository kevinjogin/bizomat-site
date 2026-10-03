// Contact form contract shared by the browser form and the Cloudflare function.
// Keep this file dependency-free so it runs in the browser, Workers and Node tests alike.

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 200 },
  organisation: { max: 150 },
  subject: { min: 3, max: 150 },
  message: { min: 20, max: 5000 },
} as const;

export const SUBJECTS = [
  'General enquiry',
  'Collaboration',
  'An idea to discuss',
  'Supplier or manufacturer',
  'Business conversation',
  'Something else',
] as const;

/** Hidden field that people never see; bots tend to fill it. */
export const HONEYPOT_FIELD = 'botcheck'; // Web3Forms' own honeypot name; the Worker checks it too.

export interface ContactInput {
  name: string;
  email: string;
  organisation: string;
  subject: string;
  message: string;
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
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export const clean = (value: unknown, max: number) => String(value ?? '').replace(CONTROL, '').trim().slice(0, max);

export function normalise(data: Record<string, unknown>): ContactInput {
  return {
    name: clean(data.name, CONTACT_LIMITS.name.max),
    email: clean(data.email, CONTACT_LIMITS.email.max).toLowerCase(),
    organisation: clean(data.organisation, CONTACT_LIMITS.organisation.max),
    subject: clean(data.subject, CONTACT_LIMITS.subject.max),
    message: clean(data.message, CONTACT_LIMITS.message.max),
    consent: data.consent === true || data.consent === 'on' || data.consent === 'true',
  };
}

export function validate(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  if (input.name.length < CONTACT_LIMITS.name.min) errors.name = 'Please enter your name.';
  if (!EMAIL.test(input.email)) errors.email = 'Please enter a valid email address, for example name@example.com.';
  if (input.subject.length < CONTACT_LIMITS.subject.min) errors.subject = 'Please choose or enter a subject.';
  if (input.message.length < CONTACT_LIMITS.message.min)
    errors.message = `Please write a little more (at least ${CONTACT_LIMITS.message.min} characters).`;
  else if ((input.message.match(/https?:\/\//gi) ?? []).length > 3) errors.message = 'Please include no more than three links.';
  if (!input.consent) errors.consent = 'Please confirm you have read the privacy notice.';
  return errors;
}
