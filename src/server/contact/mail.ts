// Mail delivery adapters. Choose one with the MAIL_PROVIDER environment variable.
//   resend  → https://resend.com (free tier). Needs RESEND_API_KEY, CONTACT_TO, CONTACT_FROM.
//   log     → writes the message to the Worker log only. Useful for testing before email is set up.
// Add another provider by adding a case below; nothing else needs to change.
import { enquirySubject, type ContactInput } from '../../lib/contact.ts';

export interface MailEnv {
  MAIL_PROVIDER?: 'resend' | 'log' | string;
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

export type MailResult = { ok: true } | { ok: false; status: number; message: string };

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();

export function composeMessage(input: ContactInput) {
  const subject = oneLine(enquirySubject(input));
  const rows: Array<[string, string]> = [
    ['Name', input.name],
    ['Company', input.company || '—'],
    ['Email', input.email],
    ['Phone', input.phone || '—'],
    ['Service', input.service],
    ['Preferred contact', input.contactMethod],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${input.message}\n`;
  const html =
    `<p>${rows.map(([k, v]) => `<strong>${k}:</strong> ${escapeHtml(v)}`).join('<br>')}</p>` +
    `<p>${escapeHtml(input.message).replace(/\n/g, '<br>')}</p>`;
  return { subject, text, html };
}

const NOT_CONFIGURED: MailResult = { ok: false, status: 503, message: 'The contact form is not connected yet. Please try again soon.' };

export async function sendMail(env: MailEnv, input: ContactInput): Promise<MailResult> {
  const { subject, text, html } = composeMessage(input);
  switch (env.MAIL_PROVIDER) {
    case 'resend': {
      if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) return NOT_CONFIGURED;
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: env.CONTACT_FROM, to: env.CONTACT_TO.split(',').map((s) => s.trim()), reply_to: input.email, subject, text, html }),
      }).catch(() => null);
      return res?.ok ? { ok: true } : { ok: false, status: 502, message: 'Your message could not be delivered right now. Please try again later.' };
    }
    case 'log':
      console.log(JSON.stringify({ contact: { subject, from: input.email, length: input.message.length } }));
      return { ok: true };
    default:
      return NOT_CONFIGURED;
  }
}
