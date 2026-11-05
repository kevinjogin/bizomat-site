// /api/assessment: server-side intake for Engineering Problem Assessment enquiries.
// Active when the site's contact provider is 'worker' (PUBLIC_CONTACT_PROVIDER=worker) and Worker mail is
// configured; until then the page posts to Web3Forms, which verifies the hCaptcha token server-side.
// The same checks as /api/contact apply: origin, size, honeypot, fill time, validation and rate limit.
// No files are accepted and nothing is stored; the enquiry is emailed to BIZOMAT only.
import { ASSESSMENT } from '../../config/assessment.ts';
import { HONEYPOT_FIELD } from '../../lib/contact.ts';
import { composeAssessment, normaliseAssessment, validateAssessment, type AssessmentResponse } from '../../lib/assessment.ts';
import { sendEmail } from '../contact/mail.ts';
import { checkRateLimit } from '../contact/rate-limit.ts';
import type { ContactEnv } from '../contact/handler.ts';
import { readBoundedText } from '../security.ts';

const MIN_FILL_MS = 3000;
const MAX_BODY_BYTES = 24_000;

function respond(request: Request, status: number, body: AssessmentResponse): Response {
  const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');
  if (!wantsJson) {
    return new Response(null, { status: 303, headers: { Location: body.ok ? '/assessment/received/' : '/contact/error/', 'Cache-Control': 'no-store' } });
  }
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
}

function sameOrigin(request: Request, env: ContactEnv): boolean {
  const origin = request.headers.get('Origin');
  if (!origin) return request.headers.get('Sec-Fetch-Site') !== 'cross-site';
  const allowed = (env.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (allowed.length) return allowed.includes(origin);
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export async function handleAssessment(request: Request, env: ContactEnv): Promise<Response> {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  if (!sameOrigin(request, env)) return respond(request, 403, { ok: false, message: 'This request is not allowed.' });
  const type = request.headers.get('Content-Type') ?? '';
  if (!type.includes('multipart/form-data') && !type.includes('application/x-www-form-urlencoded')) {
    return respond(request, 415, { ok: false, message: 'Unsupported request format.' });
  }
  if (Number(request.headers.get('Content-Length') ?? 0) > MAX_BODY_BYTES) return respond(request, 413, { ok: false, message: 'Your enquiry is too long.' });

  let form: FormData;
  try {
    const text = await readBoundedText(request, MAX_BODY_BYTES);
    if (text === null) return respond(request, 413, { ok: false, message: 'Your enquiry is too long.' });
    form = await new Response(text, { headers: { 'Content-Type': type } }).formData();
  } catch {
    return respond(request, 400, { ok: false, message: 'The form could not be read. Please try again.' });
  }
  // Files are never accepted through the website.
  for (const value of form.values()) if (typeof value !== 'string') return respond(request, 400, { ok: false, message: 'Attachments are not accepted through this form.' });

  if (String(form.get(HONEYPOT_FIELD) ?? '').trim()) return respond(request, 200, { ok: true, message: ASSESSMENT.successMessage });
  const startedAt = Number(form.get('startedAt'));
  if (startedAt && Date.now() - startedAt < MIN_FILL_MS) return respond(request, 200, { ok: true, message: ASSESSMENT.successMessage });

  const fields: Record<string, unknown> = Object.fromEntries(form);
  fields.materials = form.getAll('materials').map(String);
  const input = normaliseAssessment(fields);
  const errors = validateAssessment(input);
  if (Object.keys(errors).length) return respond(request, 422, { ok: false, message: 'Please check the highlighted fields.', errors });

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (!(await checkRateLimit(env, ip, 'assessment'))) {
    return respond(request, 429, { ok: false, message: 'Too many enquiries have been sent from your connection. Please try again later.' });
  }

  const result = await sendEmail(env, { ...composeAssessment(input), replyTo: input.email });
  if (!result.ok) return respond(request, result.status, { ok: false, message: result.message });
  return respond(request, 200, { ok: true, message: ASSESSMENT.successMessage });
}
