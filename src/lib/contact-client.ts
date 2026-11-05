// Browser-side contact submission. Both the contact page and the chat assistant's
// "leave a message" form call submitContact(); swapping providers never touches the UI.
import { SITE } from '../config/site.ts';
import { enquirySubject, type ContactInput, type ContactResponse } from './contact.ts';

const SUCCESS = 'Thank you. Your enquiry has been sent and BIZOMAT will reply as soon as possible.';
export const CONTACT_FAILURE_MESSAGE = 'Your message could not be sent. Please try again or email kevin@kevos.com.';
const FAILURE = CONTACT_FAILURE_MESSAGE;

export interface Submission extends ContactInput {
  /** Where the message came from, e.g. "Contact page" or "Website assistant". */
  source: string;
  /** Value of the honeypot field; anything here means a bot. */
  honeypot?: string;
  /** When the visitor started filling in the form (ms since epoch). */
  startedAt?: number;
  /** Turnstile for the contact page; hCaptcha for the unchanged Web3Forms surfaces. */
  captcha?: string;
}

export async function submitContact(s: Submission, delivery: 'web3forms' | 'worker' = SITE.contact.provider): Promise<ContactResponse> {
  if (delivery === 'worker') {
    try {
      const form = new FormData();
      for (const [key, value] of Object.entries({
        name: s.name, email: s.email, company: s.company, phone: s.phone, service: s.service, website: s.website, resource: s.resource,
        message: s.message, contactMethod: s.contactMethod, consent: s.consent ? 'on' : '',
        source: s.source, botcheck: s.honeypot || '', 'cf-turnstile-response': s.captcha || '',
      })) form.append(key, value);
      const res = await fetch('/api/contact', { method: 'POST', body: form, credentials: 'same-origin', headers: { Accept: 'application/json' } });
      const body = await res.json() as { success?: boolean; message?: string; errors?: ContactResponse['errors'] };
      return res.ok && body.success === true
        ? { ok: true, message: body.message || 'Thank you. Your message has been sent.' }
        : { ok: false, message: body.message || FAILURE, errors: body.errors };
    } catch { return { ok: false, message: FAILURE }; }
  }
  // Spam traps: pretend success, send nothing.
  if (s.honeypot) return { ok: true, message: SUCCESS };
  if (s.startedAt && Date.now() - s.startedAt < 3000) return { ok: true, message: SUCCESS };

  const { web3formsAccessKey, web3formsEndpoint } = SITE.contact;
  try {
    if (delivery === 'web3forms') {
      const res = await fetch(web3formsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3formsAccessKey,
          subject: enquirySubject(s),
          from_name: 'BIZOMAT website',
          replyto: s.email,
          name: s.name,
          company: s.company || '—',
          email: s.email,
          phone: s.phone || '—',
          service: s.service,
          website: s.website || '—',
          related_resource: s.resource || '—',
          preferred_contact: s.contactMethod,
          message: s.message,
          source: s.source,
          privacy_acknowledged: s.consent ? 'Yes' : 'No',
          botcheck: false,
          'h-captcha-response': s.captcha ?? '',
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      return res.ok && body.success ? { ok: true, message: SUCCESS } : { ok: false, message: FAILURE };
    }

    return { ok: false, message: FAILURE };
  } catch {
    return { ok: false, message: 'Your enquiry could not be sent. Please check your connection and try again.' };
  }
}
