// Contact enquiries use the native Cloudflare Email Service binding only.
// The assessment form's existing delivery adapters remain separate.
import type { ContactInput } from '../../lib/contact.ts';

export const CONTACT_RECIPIENT = 'kevin@kevos.com';
export const CONTACT_SENDER = 'contact-form@kevos.com';
export const CONTACT_FAILURE = 'Your message could not be sent. Please try again or email kevin@kevos.com.';

export interface ContactEmail {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}
export interface ContactEmailBinding {
  send(message: ContactEmail): Promise<{ messageId: string }>;
}
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function composeContactEmail(input: ContactInput, subject: string, submittedAt: string, country?: string): ContactEmail {
  const safeSubject = subject.replace(/[\r\n\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, 160);
  const rows: Array<[string, string]> = [
    ['Name', input.name], ['Visitor email', input.email],
    ...(input.company ? [['Company', input.company] as [string, string]] : []),
    ...(safeSubject ? [['Subject', safeSubject] as [string, string]] : []),
    ['Service required', input.service],
    ...(input.phone ? [['Phone', input.phone] as [string, string]] : []),
    ['Preferred contact method', input.contactMethod], ['Submission time (UTC)', submittedAt],
    ...(country ? [['Request IP country', country] as [string, string]] : []),
  ];
  return {
    from: CONTACT_SENDER, to: CONTACT_RECIPIENT, replyTo: input.email,
    subject: safeSubject ? `New KEVOS enquiry: ${safeSubject}` : 'New KEVOS website enquiry',
    text: `${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\nMessage:\n${input.message}\n`,
    html: `<dl>${rows.map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`).join('')}</dl><p><strong>Message:</strong></p><p>${escapeHtml(input.message).replace(/\r\n|\r|\n/g, '<br>')}</p>`,
  };
}
