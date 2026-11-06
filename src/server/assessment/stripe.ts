// /api/assessment/stripe-webhook: optional, server-side payment verification for the A$195 assessment.
//
// Disabled (503) until STRIPE_WEBHOOK_SECRET is set as a Worker secret. When enabled, every event's
// Stripe-Signature header is verified with HMAC-SHA256 before anything is trusted, so a redirect or a
// forged request can never mark an assessment as paid. A verified, fully paid A$195 AUD Checkout Session
// (from a Stripe Payment Link or Checkout) emails BIZOMAT a "payment verified" notice; nothing is sent to
// the customer (Stripe issues its own receipt) and nothing is stored. Card details never touch BIZOMAT.
import { ASSESSMENT } from '../../config/assessment.ts';
import { sendEmail, type MailEnv } from '../contact/mail.ts';

export interface StripeEnv extends MailEnv {
  /** Signing secret of the webhook endpoint in the Stripe dashboard (whsec_…). Secret: never commit it. */
  STRIPE_WEBHOOK_SECRET?: string;
}

const TOLERANCE_SECONDS = 300;
const encoder = new TextEncoder();

const toHex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function stripeSignature(payload: string, timestamp: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toHex(await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}.${payload}`)));
}

/** Verify a Stripe-Signature header (t=…,v1=…) against the raw request body. */
export async function verifyStripeSignature(payload: string, header: string | null, secret: string, nowMs = Date.now()): Promise<boolean> {
  if (!header || !secret) return false;
  const parts = header.split(',').map((p) => p.trim().split('='));
  const timestamp = parts.find(([k]) => k === 't')?.[1] ?? '';
  const signatures = parts.filter(([k]) => k === 'v1').map(([, v]) => v ?? '');
  if (!/^\d+$/.test(timestamp) || !signatures.length) return false;
  if (Math.abs(nowMs / 1000 - Number(timestamp)) > TOLERANCE_SECONDS) return false;
  const expected = await stripeSignature(payload, timestamp, secret);
  return signatures.some((s) => safeEqual(s, expected));
}

interface CheckoutSession {
  id?: string;
  amount_total?: number;
  currency?: string;
  payment_status?: string;
  client_reference_id?: string | null;
  customer_details?: { email?: string | null; name?: string | null } | null;
  created?: number;
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

export async function handleStripeWebhook(request: Request, env: StripeEnv): Promise<Response> {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  if (!env.STRIPE_WEBHOOK_SECRET) return json(503, { received: false, message: 'Online payment verification is not configured.' });

  const payload = await request.text();
  if (!(await verifyStripeSignature(payload, request.headers.get('Stripe-Signature'), env.STRIPE_WEBHOOK_SECRET))) {
    return json(400, { received: false, message: 'Invalid signature.' });
  }

  let event: { id?: string; type?: string; data?: { object?: CheckoutSession } };
  try {
    event = JSON.parse(payload);
  } catch {
    return json(400, { received: false, message: 'Invalid payload.' });
  }

  const handled = event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded';
  const s = event.data?.object ?? {};
  const isAssessment = s.currency === ASSESSMENT.currency.toLowerCase() && s.amount_total === ASSESSMENT.price * 100;
  if (!handled || s.payment_status !== 'paid' || !isAssessment) return json(200, { received: true, verified: false });

  const reference = (s.client_reference_id ?? '').replace(/[^\w-]/g, '').slice(0, 60) || 'not supplied';
  const rows: Array<[string, string]> = [
    ['Status', 'PAID (verified by Stripe webhook signature)'],
    ['Assessment reference', reference],
    ['Amount', `${ASSESSMENT.priceLabel} ${ASSESSMENT.currency}`],
    ['Customer email', s.customer_details?.email ?? '—'],
    ['Customer name', s.customer_details?.name ?? '—'],
    ['Stripe Checkout Session', s.id ?? '—'],
    ['Stripe event', event.id ?? '—'],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nNext step: send the booking instructions (template 6, docs/assessment/email-templates.md).\n`;
  const escape = (v: string) => v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
  const html = `<p>${rows.map(([k, v]) => `<strong>${k}:</strong> ${escape(v)}`).join('<br>')}</p><p>Next step: send the booking instructions (template 6).</p>`;
  const sent = await sendEmail(env, { subject: `BIZOMAT assessment payment verified: ${reference}`, text, html });
  if (!sent.ok) console.log(JSON.stringify({ assessmentPayment: { reference, session: s.id, notified: false } }));
  return json(200, { received: true, verified: true, notified: sent.ok });
}
