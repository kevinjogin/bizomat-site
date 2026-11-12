// Sign-up protection (owner's request, 12 Nov 2026): only addresses that can really receive mail create accounts and
// sign in. The founder sets the policy in the founder console (Sign-up protection); it is stored in system_kv.
//
//   1. Disposable domains: a built-in list of well-known temporary-mail services, and their subdomains.
//   2. The founder's own blocked domains, and an "always allow" list that overrides every check.
//   3. Mail servers: the domain must publish MX records (and not a "null MX", RFC 7505). Checked with DNS over HTTPS
//      (Cloudflare 1.1.1.1), so it works the same on Node and on Workers. If DNS cannot be reached the address is let
//      through (and the refusal log says so): a DNS outage must not stop real people.
//   4. Email confirmation: when email is connected, a new account signs in only after opening the link sent to it
//      (routes/auth.ts). Accounts that existed before 12 Nov 2026 are confirmed (migration 0007).
//
// Platform administrators are never refused at sign-in, so the founder cannot be locked out by a policy change.

import type { Env } from '../env';
import { now, parseJson } from '../lib/util';

const KV_KEY = 'signup_protection';

export interface SignupPolicy {
  blockDisposable: boolean;
  requireMx: boolean;
  requireVerification: boolean;
  blockedDomains: string[];
  allowedDomains: string[];
  updatedAt?: number | null;
  updatedBy?: string | null;
}

export const DEFAULT_POLICY: SignupPolicy = { blockDisposable: true, requireMx: true, requireVerification: true, blockedDomains: [], allowedDomains: [] };

export async function loadPolicy(db: D1Database): Promise<SignupPolicy> {
  let raw: string | undefined;
  try {
    raw = (await db.prepare('SELECT value FROM system_kv WHERE key = ?').bind(KV_KEY).first<{ value: string }>())?.value;
  } catch {
    raw = undefined;
  }
  const p = parseJson<Partial<SignupPolicy>>(raw, {});
  return {
    blockDisposable: p.blockDisposable ?? DEFAULT_POLICY.blockDisposable,
    requireMx: p.requireMx ?? DEFAULT_POLICY.requireMx,
    requireVerification: p.requireVerification ?? DEFAULT_POLICY.requireVerification,
    blockedDomains: Array.isArray(p.blockedDomains) ? p.blockedDomains : [],
    allowedDomains: Array.isArray(p.allowedDomains) ? p.allowedDomains : [],
    updatedAt: p.updatedAt ?? null,
    updatedBy: p.updatedBy ?? null,
  };
}

export async function savePolicy(db: D1Database, p: SignupPolicy) {
  const t = now();
  await db
    .prepare('INSERT INTO system_kv (key, value, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(key) DO UPDATE SET value = ?2, updated_at = ?3')
    .bind(KV_KEY, JSON.stringify({ ...p, updatedAt: t }), t)
    .run();
}

/** A domain as typed by the founder or taken from an address: lower case, no "@", no trailing dot. */
export function normaliseDomain(d: string): string | null {
  const s = d.trim().toLowerCase().replace(/^.*@/, '').replace(/\.+$/, '');
  return /^(?=.{3,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z][a-z0-9-]{0,61}[a-z0-9]$/.test(s) ? s : null;
}

export function domainOf(email: string): string {
  return email.trim().toLowerCase().split('@').pop()!.replace(/\.+$/, '');
}

/** The domain or one of its parents is in the list (so a subdomain of a blocked service is blocked too). */
export function inList(domain: string, list: Iterable<string>): boolean {
  for (const d of list) if (domain === d || domain.endsWith(`.${d}`)) return true;
  return false;
}

// Well-known disposable (temporary inbox) services. Not every such service: the founder adds more in the console,
// and the MX check catches made-up domains. Forwarding services people use for privacy (SimpleLogin, addy.io, Apple
// Hide My Email, Firefox Relay, DuckDuckGo) are deliberately not here: their addresses reach a real person.
export const DISPOSABLE_DOMAINS: ReadonlySet<string> = new Set([
  '10minutemail.com', '10minutemail.net', '10minutemail.co.uk', '20minutemail.com', '1secmail.com', '1secmail.net', '1secmail.org',
  'armyspy.com', 'binkmail.com', 'bobmail.info', 'burnermail.io', 'byom.de', 'chammy.info', 'cuvox.de', 'dayrep.com',
  'devnullmail.com', 'discard.email', 'discardmail.com', 'discardmail.de', 'dispostable.com', 'dropmail.me', 'einrot.com',
  'emailfake.com', 'email-fake.com', 'emailondeck.com', 'emltmp.com', 'fakeinbox.com', 'fakemail.net', 'fakemailgenerator.com',
  'fleckens.hu', 'getairmail.com', 'getnada.com', 'grr.la', 'guerrillamail.biz', 'guerrillamail.com', 'guerrillamail.de',
  'guerrillamail.info', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamailblock.com', 'gustr.com', 'harakirimail.com',
  'incognitomail.org', 'inboxkitten.com', 'jetable.org', 'jourrapide.com', 'letthemeatspam.com', 'mail.tm', 'mail.gw',
  'mailcatch.com', 'maildrop.cc', 'mailexpire.com', 'mailforspam.com', 'mailinater.com', 'mailinator.com', 'mailinator.net',
  'mailinator.org', 'mailinator2.com', 'mailismagic.com', 'mailmetrash.com', 'mailmoat.com', 'mailnator.com', 'mailnesia.com',
  'mailnull.com', 'mailpoof.com', 'mailtothis.com', 'mintemail.com', 'minuteinbox.com', 'moakt.cc', 'moakt.com', 'mohmal.com',
  'monumentmail.com', 'mytemp.email', 'mytrashmail.com', 'nada.email', 'notmailinator.com', 'objectmail.com', 'oneoffemail.com',
  'pokemail.net', 'putthisinyourspamdatabase.com', 'rhyta.com', 'safetymail.info', 'sendspamhere.com', 'sharklasers.com',
  'shieldemail.com', 'sogetthis.com', 'spam4.me', 'spambog.com', 'spambox.us', 'spamex.com', 'spamfree24.org', 'spamgourmet.com',
  'spamherelots.com', 'spamhereplease.com', 'spamthisplease.com', 'streetwisemail.com', 'superrito.com', 'suremail.info',
  'teleworm.us', 'tempail.com', 'temp-mail.io', 'temp-mail.org', 'tempemail.net', 'tempinbox.com', 'tempmail.com',
  'tempmail.dev', 'tempmail.net', 'tempmail.plus', 'tempmailaddress.com', 'tempmailo.com', 'tempomail.fr', 'temporaryemail.net',
  'temporaryinbox.com', 'tempr.email', 'thisisnotmyrealemail.com', 'throwam.com', 'throwawaymail.com', 'tmail.ws', 'tmpmail.net',
  'tmpmail.org', 'tradermail.info', 'trash-mail.com', 'trashmail.com', 'trashmail.de', 'trashmail.io', 'trashmail.net',
  'trashmail.me', 'trashymail.com', 'veryrealemail.com', 'wegwerfmail.de', 'wegwerfmail.net', 'wegwerfmail.org', 'yopmail.com',
  'yopmail.fr', 'yopmail.net', 'zehnminutenmail.de', 'zippymail.info',
]);

// ------------------------------------------------------------------ mail servers (MX over DNS-over-HTTPS)

export type MxResult = 'ok' | 'no_mx' | 'null_mx' | 'nxdomain' | 'unknown';
export type MxResolver = (domain: string) => Promise<MxResult>;

let resolverOverride: MxResolver | null = null;
/** Tests replace DNS; in the test and development environments DNS is otherwise not asked (results are 'unknown'). */
export function setMxResolverForTests(r: MxResolver | null) {
  resolverOverride = r;
}

export async function dohMx(domain: string, fetchImpl: typeof fetch = fetch): Promise<MxResult> {
  try {
    const res = await fetchImpl(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`, {
      headers: { accept: 'application/dns-json' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return 'unknown';
    const j = (await res.json()) as { Status?: number; Answer?: { type: number; data: string }[] };
    if (j.Status === 3) return 'nxdomain';
    if (j.Status !== 0) return 'unknown';
    const mx = (j.Answer ?? []).filter((a) => a.type === 15).map((a) => String(a.data).trim().split(/\s+/));
    if (!mx.length) return 'no_mx';
    // RFC 7505: a single "0 ." record says the domain accepts no mail at all.
    if (mx.every(([, host]) => host === '.' || host === '')) return 'null_mx';
    return 'ok';
  } catch {
    return 'unknown';
  }
}

async function lookupMx(env: Env, domain: string): Promise<MxResult> {
  if (resolverOverride) return resolverOverride(domain);
  if (env.ENVIRONMENT === 'test' || env.ENVIRONMENT === 'development') return 'unknown';
  const key = `mx:${domain}`;
  try {
    const hit = await env.CACHE.get(key);
    if (hit) return hit as MxResult;
  } catch {
    // no cache: ask DNS
  }
  const r = await dohMx(domain);
  if (r !== 'unknown') {
    try {
      // A day for a working domain; an hour for a refusal, so a domain that is being set up is not refused for long.
      await env.CACHE.put(key, r, { expirationTtl: r === 'ok' ? 86_400 : 3_600 });
    } catch {
      // caching is best effort
    }
  }
  return r;
}

// ------------------------------------------------------------------ the check

export type RefusalReason = 'disposable' | 'blocked_domain' | 'no_mail_server' | 'domain_not_found' | 'bot';

export type AddressCheck =
  | { ok: true; domain: string; allowed: boolean; mx: MxResult | 'skipped' }
  | { ok: false; domain: string; reason: RefusalReason; message: string; mx?: MxResult };

export const REFUSAL_LABELS: Record<RefusalReason, string> = {
  disposable: 'Disposable address',
  blocked_domain: 'Blocked domain',
  no_mail_server: 'Domain receives no email',
  domain_not_found: 'Domain does not exist',
  bot: 'Automated sign-up (hidden field filled)',
};

/** The policy's verdict on one address (no side effects). `dns: false` skips the mail-server lookup (sign-in). */
export async function checkAddress(env: Env, email: string, policy: SignupPolicy, opts: { dns?: boolean } = {}): Promise<AddressCheck> {
  const domain = domainOf(email);
  if (inList(domain, policy.allowedDomains)) return { ok: true, domain, allowed: true, mx: 'skipped' };
  if (inList(domain, policy.blockedDomains)) return { ok: false, domain, reason: 'blocked_domain', message: `Email addresses at ${domain} cannot be used here.` };
  if (policy.blockDisposable && inList(domain, DISPOSABLE_DOMAINS)) {
    return { ok: false, domain, reason: 'disposable', message: 'Temporary or disposable email addresses cannot be used. Use your work or personal email address.' };
  }
  if (!policy.requireMx || opts.dns === false) return { ok: true, domain, allowed: false, mx: 'skipped' };
  const mx = await lookupMx(env, domain);
  if (mx === 'nxdomain') return { ok: false, domain, reason: 'domain_not_found', mx, message: `The domain ${domain} does not exist. Check the spelling of your email address.` };
  if (mx === 'no_mx' || mx === 'null_mx') return { ok: false, domain, reason: 'no_mail_server', mx, message: `${domain} does not receive email, so this address cannot be used. Check the spelling of your email address.` };
  return { ok: true, domain, allowed: false, mx };
}

/** A refusal in the audit log: the domain and the reason, never the whole address. */
export function refusalMetadata(c: { domain: string; reason: RefusalReason; mx?: MxResult }, where: 'signup' | 'login' | 'oauth' | 'invitation') {
  return { where, reason: c.reason, domain: c.domain, ...(c.mx ? { mx: c.mx } : {}) };
}
