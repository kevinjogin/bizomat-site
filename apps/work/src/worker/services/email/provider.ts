// The email provider abstraction. BIZOMAT talks to `EmailProvider` only; Brevo is one implementation, so another
// provider can be added here without touching the outbox, the templates or the routes.

import type { Env } from '../../env';
import { appBase, appUrlProblem } from '../app-url';

export interface OutgoingEmail {
  to: { email: string; name?: string };
  from: { email: string; name: string };
  replyTo?: { email: string } | null;
  subject: string;
  html: string;
  text: string;
  tags: string[];
  /** Echoed back by the provider's webhooks (Brevo: X-Mailin-custom). */
  correlationId: string;
}

export type SendResult =
  | { ok: true; messageId: string | null }
  | {
      ok: false;
      /** permanent: never retried; retry: try again later; quota: the provider's sending limit; config: key, sender or account problem */
      kind: 'permanent' | 'retry' | 'quota' | 'config';
      status: number | null;
      error: string;
      retryAfterMs?: number;
    };

export interface EmailProvider {
  readonly name: string;
  send(msg: OutgoingEmail): Promise<SendResult>;
}

export interface EmailConfig {
  /** 'test': a provider set by the test suite (setEmailProviderForTests). */
  provider: 'brevo' | 'log' | 'none' | 'test';
  from: { email: string; name: string };
  replyTo: string | null;
  /** The validated public address of the app (services/app-url.ts); empty when the configuration is wrong. */
  baseUrl: string;
  /** Why links cannot be built, when they cannot (then no email with links is sent). */
  baseUrlProblem: string | null;
  dailyLimit: number;
  criticalReserve: number;
  sandbox: boolean;
  webhookConfigured: boolean;
}

/** Tests replace the provider; production never sets this. */
let overrideProvider: EmailProvider | null = null;

function intOr(raw: string | undefined, fallback: number, min: number, max: number): number {
  const n = Number(raw);
  return raw && Number.isInteger(n) && n >= min && n <= max ? n : fallback;
}

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

export function emailConfig(env: Env): EmailConfig {
  const explicit = (env.EMAIL_PROVIDER ?? '').trim().toLowerCase();
  let provider: EmailConfig['provider'];
  if (overrideProvider) provider = 'test';
  else if (explicit === 'brevo') provider = env.BREVO_API_KEY ? 'brevo' : 'none';
  else if (explicit === 'log') provider = 'log';
  else if (explicit === 'none') provider = 'none';
  // No key: development mode keeps messages in the outbox without sending; elsewhere email is off.
  else provider = env.BREVO_API_KEY ? 'brevo' : env.ENVIRONMENT === 'development' ? 'log' : 'none';
  const fromEmail = (env.EMAIL_FROM_ADDRESS ?? '').trim();
  const replyTo = (env.EMAIL_REPLY_TO ?? '').trim();
  // Links in emails come from configuration only, never from the request (services/app-url.ts).
  const baseUrlProblem = appUrlProblem(env);
  const base = baseUrlProblem ? '' : appBase(env).href;
  return {
    provider,
    from: { email: EMAIL_RE.test(fromEmail) ? fromEmail : 'notifications@bizomat.ai', name: (env.EMAIL_FROM_NAME ?? '').trim().slice(0, 70) || 'BIZOMAT' },
    replyTo: EMAIL_RE.test(replyTo) ? replyTo : null,
    baseUrl: base,
    baseUrlProblem,
    dailyLimit: intOr(env.EMAIL_DAILY_LIMIT, 250, 1, 100_000),
    criticalReserve: intOr(env.EMAIL_CRITICAL_RESERVE, 40, 0, 100_000),
    sandbox: env.EMAIL_SANDBOX === '1',
    webhookConfigured: !!env.BREVO_WEBHOOK_TOKEN,
  };
}

export const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

/**
 * Brevo's transactional API: POST /v3/smtp/email with the api-key header; 201 with { messageId } on success.
 * The key is read from the environment on the server only and never logged or returned.
 */
export class BrevoProvider implements EmailProvider {
  readonly name = 'brevo';
  constructor(
    private apiKey: string,
    private sandbox: boolean,
    private fetchImpl: typeof fetch = fetch,
  ) {}

  async send(msg: OutgoingEmail): Promise<SendResult> {
    const headers: Record<string, string> = { 'X-Mailin-custom': `outbox_id:${msg.correlationId}` };
    if (this.sandbox) headers['X-Sib-Sandbox'] = 'drop';
    const payload = {
      sender: msg.from,
      to: [{ email: msg.to.email, ...(msg.to.name ? { name: msg.to.name.slice(0, 70) } : {}) }],
      ...(msg.replyTo ? { replyTo: msg.replyTo } : {}),
      subject: msg.subject,
      htmlContent: msg.html,
      textContent: msg.text,
      tags: msg.tags,
      headers,
    };
    let res: Response;
    try {
      res = await this.fetchImpl(BREVO_ENDPOINT, {
        method: 'POST',
        headers: { 'api-key': this.apiKey, 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15_000),
      });
    } catch (e) {
      return { ok: false, kind: 'retry', status: null, error: `Network error: ${e instanceof Error ? e.name : 'unknown'}` };
    }
    const text = await res.text().catch(() => '');
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }
    if (res.ok) return { ok: true, messageId: typeof data?.messageId === 'string' ? data.messageId : null };
    const detail = `${res.status}${data?.code ? ` ${String(data.code).slice(0, 60)}` : ''}${data?.message ? `: ${String(data.message).slice(0, 200)}` : ''}`;
    if (res.status === 429) {
      const ra = Number(res.headers.get('retry-after'));
      return { ok: false, kind: 'retry', status: 429, error: `Rate limited by Brevo (${detail})`, retryAfterMs: Number.isFinite(ra) && ra > 0 ? ra * 1000 : 60_000 };
    }
    if (res.status === 402) return { ok: false, kind: 'quota', status: 402, error: `Brevo sending credits exhausted (${detail})` };
    if (res.status === 401 || res.status === 403) return { ok: false, kind: 'config', status: res.status, error: `Brevo refused the request: check the API key, the sender and authorised IPs (${detail})` };
    if (res.status >= 500) return { ok: false, kind: 'retry', status: res.status, error: `Brevo error (${detail})` };
    return { ok: false, kind: 'permanent', status: res.status, error: `Brevo rejected the message (${detail})` };
  }
}

/** Development mode: the message is stored in the outbox and marked sent, but nothing leaves the server. */
export class LogProvider implements EmailProvider {
  readonly name = 'log';
  async send(msg: OutgoingEmail): Promise<SendResult> {
    console.log(JSON.stringify({ t: new Date().toISOString(), msg: 'email_logged', template: msg.tags[0] ?? null, outbox: msg.correlationId }));
    return { ok: true, messageId: `log-${msg.correlationId}` };
  }
}

export function setEmailProviderForTests(p: EmailProvider | null) {
  overrideProvider = p;
}

export function providerFor(env: Env, cfg = emailConfig(env)): EmailProvider | null {
  if (overrideProvider) return overrideProvider;
  if (cfg.provider === 'brevo' && env.BREVO_API_KEY) return new BrevoProvider(env.BREVO_API_KEY, cfg.sandbox);
  if (cfg.provider === 'log') return new LogProvider();
  return null;
}
