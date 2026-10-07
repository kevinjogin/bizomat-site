// Contact endpoint logic, independent of hosting. Used by src/worker.ts (dist/_worker.js) on Cloudflare
// and by tests in Node. It returns ContactResponse JSON for fetch() requests and redirects plain
// HTML form posts (no JavaScript) to /contact/sent/ or /contact/error/.
import { HONEYPOT_FIELD, normalise, validate, type ContactResponse } from '../../lib/contact.ts';
import { sendMail, type MailEnv } from './mail.ts';
import { checkRateLimit, type RateLimitEnv } from './rate-limit.ts';

export interface ContactEnv extends MailEnv, RateLimitEnv {
  /** Comma-separated list of origins allowed to post, e.g. "https://gocore.com.au,https://www.gocore.com.au". */
  ALLOWED_ORIGINS?: string;
}

const MIN_FILL_MS = 3000;
const MAX_BODY_BYTES = 32_000;

function respond(request: Request, status: number, body: ContactResponse): Response {
  const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');
  if (!wantsJson) {
    return new Response(null, { status: 303, headers: { Location: body.ok ? '/contact/sent/' : '/contact/error/', 'Cache-Control': 'no-store' } });
  }
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function originAllowed(request: Request, env: ContactEnv): boolean {
  const origin = request.headers.get('Origin');
  if (!origin) return true; // Some privacy tools strip Origin; other checks still apply.
  const allowed = (env.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (allowed.length) return allowed.includes(origin);
  return new URL(origin).host === new URL(request.url).host;
}

export async function handleContact(request: Request, env: ContactEnv): Promise<Response> {
  const response = await processContact(request, env);
  // Cross-origin use (form on gocore.com.au, Worker on another host): let the page read the JSON reply.
  const origin = request.headers.get('Origin');
  if (origin && originAllowed(request, env) && new URL(origin).host !== new URL(request.url).host) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Vary', 'Origin');
  }
  return response;
}

async function processContact(request: Request, env: ContactEnv): Promise<Response> {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  if (!originAllowed(request, env)) return respond(request, 403, { ok: false, message: 'This request is not allowed.' });

  const type = request.headers.get('Content-Type') ?? '';
  if (!type.includes('multipart/form-data') && !type.includes('application/x-www-form-urlencoded')) {
    return respond(request, 415, { ok: false, message: 'Unsupported request format.' });
  }
  if (Number(request.headers.get('Content-Length') ?? 0) > MAX_BODY_BYTES) {
    return respond(request, 413, { ok: false, message: 'Your message is too long.' });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return respond(request, 400, { ok: false, message: 'The form could not be read. Please try again.' });
  }

  // Spam traps: report success so automated senders learn nothing, but send nothing.
  if (String(form.get(HONEYPOT_FIELD) ?? '').trim()) return respond(request, 200, { ok: true });
  const startedAt = Number(form.get('startedAt'));
  if (startedAt && Date.now() - startedAt < MIN_FILL_MS) return respond(request, 200, { ok: true });

  const input = normalise(Object.fromEntries(form));
  const errors = validate(input);
  if (Object.keys(errors).length) return respond(request, 422, { ok: false, message: 'Please check the highlighted fields.', errors });

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (!(await checkRateLimit(env, ip))) {
    return respond(request, 429, { ok: false, message: 'Too many messages have been sent from your connection. Please try again later.' });
  }

  const result = await sendMail(env, input);
  if (!result.ok) {
    return respond(request, result.status, { ok: false, message: result.message });
  }
  return respond(request, 200, { ok: true, message: 'Thank you. Your message has been sent and KEVOS will reply as soon as possible.' });
}
