// Browser-side delivery of assessment enquiries. It uses the same provider as every REACHOS form
// (SITE.contact): Web3Forms today, or the site's Worker (/api/assessment) once Worker mail is configured.
import { SITE } from '../config/site.ts';
import { ASSESSMENT } from '../config/assessment.ts';
import { assessmentRows, assessmentSubject, type AssessmentInput, type AssessmentResponse } from './assessment.ts';

const FAILURE = 'Your enquiry could not be sent right now. Please try again in a moment, or use REACHOS at /contact/.';

export interface AssessmentSubmission extends AssessmentInput {
  honeypot?: string;
  startedAt?: number;
  captcha?: string;
}

export async function submitAssessment(s: AssessmentSubmission): Promise<AssessmentResponse> {
  // Spam traps: pretend success, send nothing.
  if (s.honeypot) return { ok: true, message: ASSESSMENT.successMessage };
  if (s.startedAt && Date.now() - s.startedAt < 3000) return { ok: true, message: ASSESSMENT.successMessage };

  const { provider, web3formsAccessKey, web3formsEndpoint } = SITE.contact;
  try {
    if (provider === 'web3forms') {
      const fields = Object.fromEntries(assessmentRows(s).map(([k, v]) => [k, v]));
      const res = await fetch(web3formsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3formsAccessKey,
          subject: assessmentSubject(s),
          from_name: 'KEVOS® website: assessment',
          replyto: s.email,
          ...fields,
          'Description of the problem': s.description,
          'Current issue or impact': s.impact,
          'Desired outcome': s.outcome,
          source: 'Assessment page (/assessment/)',
          botcheck: false,
          'h-captcha-response': s.captcha ?? '',
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { success?: boolean };
      return res.ok && body.success ? { ok: true, message: ASSESSMENT.successMessage } : { ok: false, message: FAILURE };
    }

    const form = new FormData();
    const { materials, consent, honeypot, ...rest } = s;
    for (const [k, v] of Object.entries(rest)) form.append(k, String(v ?? ''));
    for (const m of materials) form.append('materials', m);
    form.append('consent', consent ? 'on' : '');
    form.append('botcheck', honeypot ?? '');
    const res = await fetch('/api/assessment', { method: 'POST', body: form, headers: { Accept: 'application/json' } });
    const body = (await res.json().catch(() => ({ ok: false }))) as AssessmentResponse;
    return res.ok && body.ok ? { ok: true, message: body.message ?? ASSESSMENT.successMessage } : { ok: false, message: body.message ?? FAILURE, errors: body.errors };
  } catch {
    return { ok: false, message: 'Your enquiry could not be sent. Please check your connection and try again.' };
  }
}
