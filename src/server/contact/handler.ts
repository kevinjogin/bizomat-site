// Same-origin /api/contact for the existing KEVOS contact form. No enquiry storage.
import { CONTACT_LIMITS, CONTACT_METHODS, HONEYPOT_FIELD, normalise, validate, type ContactErrors } from '../../lib/contact.ts';
import type { MailEnv } from './mail.ts';
import { composeContactEmail, CONTACT_FAILURE, type ContactEmailBinding } from './cloudflare-mail.ts';
import { checkRateLimit, type RateLimitEnv } from './rate-limit.ts';

export interface ContactEnv extends MailEnv, RateLimitEnv {
  EMAIL?: ContactEmailBinding;
  TURNSTILE_SECRET_KEY?: string;
  /** Retained for the separate assessment endpoint; contact accepts same-origin only. */
  ALLOWED_ORIGINS?: string;
}
const MAX_BODY_BYTES = 32_000;
const HOSTNAMES = new Set(['kevos.com', 'www.kevos.com']);
const SUCCESS = 'Thank you. Your message has been sent.';
const TURNSTILE_ERROR = 'Please complete a fresh spam check and try again.';
const LIMITS: Record<string, number> = {
  ...Object.fromEntries(Object.entries(CONTACT_LIMITS).map(([key, value]) => [key, value.max])),
  subject: 160, organisation: 150, contactMethod: 10, consent: 5, source: 80,
  startedAt: 20, [HONEYPOT_FIELD]: 100, 'cf-turnstile-response': 2048,
};
function respond(status: number, success: boolean, message: string, errors?: ContactErrors): Response {
  return new Response(JSON.stringify({ success, message, ...(errors ? { errors } : {}) }), {
    status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...(status === 405 ? { Allow: 'POST' } : {}) },
  });
}
function sameOrigin(request: Request): boolean {
  if (request.headers.get('Sec-Fetch-Site') === 'cross-site') return false;
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}
// Bound actual streamed bytes as well as Content-Length; never buffer an unbounded body.
async function readBody(request: Request): Promise<Uint8Array<ArrayBuffer> | null> {
  if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY_BYTES) return null;
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) { await reader.cancel(); return null; }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes;
}
function validEmail(email: string): boolean {
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  return local.length > 0 && local.length <= 64 && /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)
    && !local.startsWith('.') && !local.endsWith('.') && !local.includes('..')
    && domain.includes('.') && domain.split('.').every((label) => /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(label));
}
async function verifyTurnstile(token: string, request: Request, secret: string): Promise<'valid' | 'invalid' | 'unavailable'> {
  try {
    const ip = request.headers.get('CF-Connecting-IP');
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
    });
    if (!res.ok) return 'unavailable';
    const data = await res.json() as { success?: unknown; hostname?: unknown; action?: unknown };
    return data?.success === true && data.action === 'contact' && typeof data.hostname === 'string' && HOSTNAMES.has(data.hostname) ? 'valid' : 'invalid';
  } catch { return 'unavailable'; }
}
export async function handleContact(request: Request, env: ContactEnv): Promise<Response> {
  if (request.method !== 'POST') return respond(405, false, 'Please submit the contact form using POST.');
  if (!sameOrigin(request)) return respond(403, false, 'This request is not allowed.');
  const contentType = request.headers.get('Content-Type') || '';
  const type = contentType.split(';')[0].trim().toLowerCase();
  if (!['application/json', 'application/x-www-form-urlencoded', 'multipart/form-data'].includes(type)) return respond(415, false, 'Unsupported request format.');
  let fields: Record<string, unknown>;
  try {
    const bytes = await readBody(request);
    if (bytes === null) return respond(413, false, 'Your message is too long.');
    if (type === 'application/json') {
      const parsed: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return respond(400, false, 'The form could not be read.');
      fields = parsed as Record<string, unknown>;
    } else {
      const form = await new Response(bytes, { headers: { 'Content-Type': contentType } }).formData();
      fields = {};
      for (const [key, value] of form) {
        if (typeof value !== 'string' || Object.hasOwn(fields, key)) return respond(400, false, 'Attachments and repeated fields are not accepted.');
        Object.defineProperty(fields, key, { value, enumerable: true });
      }
    }
  } catch { return respond(400, false, 'The form could not be read. Please try again.'); }
  // Reject malformed and overlength values before shared normalisation can truncate them.
  for (const [key, raw] of Object.entries(fields)) {
    if (!Object.hasOwn(LIMITS, key) || (typeof raw !== 'string' && !(key === 'consent' && typeof raw === 'boolean'))) return respond(400, false, 'The form contains an unsupported field or value.');
    const value = String(raw).trim();
    if (value.length > LIMITS[key]) return respond(422, false, 'One or more fields exceed their maximum length.');
    if ((key === 'message' ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/ : /[\u0000-\u001f\u007f]/).test(value)) return respond(422, false, 'Please remove unsupported control characters from the form.');
  }
  if (String(fields[HONEYPOT_FIELD] || '').trim()) return respond(400, false, CONTACT_FAILURE);
  const input = normalise(fields);
  const errors = validate(input, { requireCompany: true });
  if (!validEmail(input.email)) errors.email = 'Please enter a valid email address, for example name@example.com.';
  if (fields.contactMethod != null && !(CONTACT_METHODS as readonly string[]).includes(String(fields.contactMethod).trim())) errors.contactMethod = 'Please choose a listed contact method.';
  if (Object.keys(errors).length) return respond(422, false, 'Please check the highlighted fields.', errors);
  const token = String(fields['cf-turnstile-response'] || '').trim();
  if (!token) return respond(403, false, TURNSTILE_ERROR);
  if (!env.TURNSTILE_SECRET_KEY?.trim()) return respond(503, false, 'Contact service configuration incomplete (CF-CONTACT-01). Please email kevin@kevos.com.');
  if (!env.EMAIL || typeof env.EMAIL.send !== 'function') return respond(503, false, 'Email service binding unavailable (CF-CONTACT-02). Please email kevin@kevos.com.');
  try {
    if (!(await checkRateLimit(env, request.headers.get('CF-Connecting-IP') || 'unknown'))) return respond(429, false, 'Too many messages have been sent from your connection. Please try again later.');
  } catch { return respond(503, false, 'Contact rate-limit service unavailable (CF-CONTACT-03). Please email kevin@kevos.com.'); }
  const verification = await verifyTurnstile(token, request, env.TURNSTILE_SECRET_KEY);
  if (verification !== 'valid') return respond(verification === 'invalid' ? 403 : 503, false, verification === 'invalid' ? TURNSTILE_ERROR : 'Spam verification service unavailable (CF-CONTACT-04). Please try again.');
  // Use Cloudflare metadata only, never a submitted country or visitor-supplied country header.
  const cfCountry = (request as Request & { cf?: { country?: unknown } }).cf?.country;
  const country = typeof cfCountry === 'string' && /^[A-Z]{2}$/.test(cfCountry) ? cfCountry : undefined;
  const email = composeContactEmail(input, String(fields.subject || '').trim(), new Date().toISOString(), country);
  try {
    const delivered = await env.EMAIL.send(email);
    if (!delivered || typeof delivered.messageId !== 'string' || !delivered.messageId) return respond(502, false, 'Email service returned no delivery reference (CF-CONTACT-05). Please email kevin@kevos.com.');
  } catch (error) {
    const code = typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string' ? error.code : '';
    const safeCodes = new Set(['E_SENDER_NOT_VERIFIED', 'E_RECIPIENT_NOT_ALLOWED', 'E_RECIPIENT_SUPPRESSED', 'E_SENDER_DOMAIN_NOT_AVAILABLE', 'E_DELIVERY_FAILED', 'E_RATE_LIMIT_EXCEEDED', 'E_DAILY_LIMIT_EXCEEDED', 'E_VALIDATION_ERROR', 'E_FIELD_MISSING']);
    const detail = safeCodes.has(code) ? code : 'DELIVERY_UNAVAILABLE';
    return respond(502, false, `Email delivery was rejected (CF-CONTACT-06: ${detail}). Please email kevin@kevos.com.`);
  }
  return respond(200, true, SUCCESS);
}
