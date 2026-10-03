// Browser-side contact submission. Both the contact page and the chat assistant's
// "leave a message" form call submitContact(); swapping providers never touches the UI.
import { SITE } from '../config/site.ts';
import { enquirySubject, type ContactInput, type ContactResponse } from './contact.ts';

const SUCCESS = 'Thank you. Your enquiry has been sent and GoCore will reply as soon as possible.';
const FAILURE = 'Your enquiry could not be sent right now. Please try again in a moment.';

export interface Submission extends ContactInput {
  /** Where the message came from, e.g. "Contact page" or "Website assistant". */
  source: string;
  /** Value of the honeypot field; anything here means a bot. */
  honeypot?: string;
  /** When the visitor started filling in the form (ms since epoch). */
  startedAt?: number;
  /** hCaptcha token, required by the Web3Forms form settings. */
  captcha?: string;
}

export async function submitContact(s: Submission): Promise<ContactResponse> {
  // Spam traps: pretend success, send nothing.
  if (s.honeypot) return { ok: true, message: SUCCESS };
  if (s.startedAt && Date.now() - s.startedAt < 3000) return { ok: true, message: SUCCESS };

  const { provider, web3formsAccessKey, web3formsEndpoint, workerEndpoint } = SITE.contact;
  try {
    if (provider === 'web3forms') {
      const res = await fetch(web3formsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3formsAccessKey,
          subject: enquirySubject(s),
          from_name: 'GoCore website',
          replyto: s.email,
          name: s.name,
          company: s.company || '—',
          email: s.email,
          phone: s.phone || '—',
          service: s.service,
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

    const form = new FormData();
    for (const [k, v] of Object.entries({ ...s, consent: s.consent ? 'on' : '' })) form.append(k, String(v ?? ''));
    const res = await fetch(workerEndpoint, { method: 'POST', body: form, headers: { Accept: 'application/json' } });
    const body = (await res.json().catch(() => ({ ok: false }))) as ContactResponse;
    return res.ok && body.ok ? { ok: true, message: body.message ?? SUCCESS } : { ok: false, message: body.message ?? FAILURE, errors: body.errors };
  } catch {
    return { ok: false, message: 'Your enquiry could not be sent. Please check your connection and try again.' };
  }
}
