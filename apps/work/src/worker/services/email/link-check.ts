// "Check an email link" (founder console > Email): follows a link from a received email the way a recipient's
// browser would, from the server: DNS for its host, HTTPS to it, then each redirect, and says where it ends. Brevo
// rewrites every link for click tracking (https://r.<tracking domain>/tr/cl/...); this shows whether that tracking
// host exists, has a valid certificate, and redirects to the original BIZOMAT address.
//
// Only links on this app's own domain (and its subdomains) or on Brevo's tracking domains are checked, and only
// redirects to those hosts are followed, so the check cannot be used to make the server fetch arbitrary addresses.
// Tokens are masked in everything returned. Opening a tracking link counts as a click in Brevo's statistics.

export interface LinkHop {
  url: string;
  host: string;
  status: number | null;
  error: string | null;
}

export interface LinkCheckResult {
  ok: boolean;
  verdict: string;
  /** Whether the first host has an address in DNS (null: DNS could not be asked). */
  dns: { host: string; resolves: boolean | null; detail: string };
  hops: LinkHop[];
  finalUrl: string | null;
}

const BREVO_TRACKING = /(^|\.)(brevolinks\.com|sendibt\d*\.com|sendibm\d*\.com|brevo\.com|sendinblue\.com)$/i;

/** bizomat.ai for bizomat.ai or app.bizomat.ai (the last two labels). */
function siteDomain(host: string): string {
  return host.split('.').slice(-2).join('.').toLowerCase();
}

export function linkHostAllowed(host: string, appHost: string): boolean {
  const h = host.toLowerCase();
  const d = siteDomain(appHost);
  return h === d || h.endsWith(`.${d}`) || BREVO_TRACKING.test(h);
}

/** Masks invitation and confirmation tokens and Brevo's tracking data. */
export function maskUrl(raw: string): string {
  try {
    const u = new URL(raw);
    u.pathname = u.pathname.replace(/(\/invite\/)[^/]+/, (_m, p) => `${p}${'•'.repeat(6)}`).replace(/(\/tr\/[a-z]+\/)[^?#]+/i, (_m, p) => `${p}…`);
    for (const k of ['token', 'invite', 'code']) if (u.searchParams.has(k)) u.searchParams.set(k, '••••••');
    return u.toString().replace(/%E2%80%A2/g, '•');
  } catch {
    return '(not a URL)';
  }
}

export type Resolver = (host: string) => Promise<{ resolves: boolean | null; detail: string }>;

/** DNS over HTTPS (Cloudflare): A, then AAAA, then CNAME. */
export const dohResolve: Resolver = async (host) => {
  try {
    const answers: string[] = [];
    let nx = false;
    for (const type of ['A', 'AAAA', 'CNAME']) {
      const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(host)}&type=${type}`, { headers: { accept: 'application/dns-json' }, signal: AbortSignal.timeout(5000) });
      if (!res.ok) continue;
      const j = (await res.json()) as { Status?: number; Answer?: { type: number; data: string }[] };
      if (j.Status === 3) nx = true;
      for (const a of j.Answer ?? []) answers.push(`${a.type === 5 ? 'CNAME' : a.type === 1 ? 'A' : a.type === 28 ? 'AAAA' : a.type} ${a.data}`);
      if (answers.length) break;
    }
    if (answers.length) return { resolves: true, detail: answers.slice(0, 4).join(', ') };
    return { resolves: false, detail: nx ? 'The name does not exist (NXDOMAIN)' : 'No address records' };
  } catch (e) {
    return { resolves: null, detail: `DNS could not be asked: ${e instanceof Error ? e.message : 'error'}` };
  }
};

/**
 * Follows `link` up to six redirects. `expected` is the address the link must reach, for example
 * https://bizomat.ai/tasks/invite/ (a prefix).
 */
export async function checkEmailLink(link: string, opts: { appHost: string; expected: string; fetchImpl?: typeof fetch; resolve?: Resolver }): Promise<LinkCheckResult> {
  const fetchImpl = opts.fetchImpl ?? fetch;
  const resolve = opts.resolve ?? dohResolve;
  let url: URL;
  try {
    url = new URL(link.trim());
  } catch {
    return { ok: false, verdict: 'That is not a web address. Copy the link from the email (right-click the button, Copy link address).', dns: { host: '', resolves: null, detail: '' }, hops: [], finalUrl: null };
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return { ok: false, verdict: 'Only web links (https) can be checked.', dns: { host: url.host, resolves: null, detail: '' }, hops: [], finalUrl: null };
  if (!linkHostAllowed(url.hostname, opts.appHost)) {
    return { ok: false, verdict: `Only links on ${siteDomain(opts.appHost)} or Brevo's tracking domains can be checked here (this one is on ${url.hostname}).`, dns: { host: url.hostname, resolves: null, detail: '' }, hops: [], finalUrl: null };
  }
  const dns = { host: url.hostname, ...(await resolve(url.hostname)) };
  const hops: LinkHop[] = [];
  let current: URL | null = url;
  for (let i = 0; current && i < 7; i++) {
    const hop: LinkHop = { url: maskUrl(current.toString()), host: current.hostname, status: null, error: null };
    hops.push(hop);
    if (!linkHostAllowed(current.hostname, opts.appHost)) {
      hop.error = 'Not followed: this host is outside BIZOMAT and Brevo';
      break;
    }
    let res: Response;
    try {
      res = await fetchImpl(current.toString(), { method: 'GET', redirect: 'manual', headers: { accept: 'text/html', 'user-agent': 'BIZOMAT email link check' }, signal: AbortSignal.timeout(10_000) });
    } catch (e) {
      hop.error = e instanceof Error ? (e.cause instanceof Error ? `${e.message}: ${e.cause.message}` : e.message) : 'request failed';
      break;
    }
    hop.status = res.status;
    const loc = res.status >= 300 && res.status < 400 ? res.headers.get('location') : null;
    void res.body?.cancel().catch(() => undefined);
    current = loc ? new URL(loc, current) : null;
  }
  const last = hops[hops.length - 1];
  const final = last && last.status != null && (last.status < 300 || last.status >= 400) ? last : null;
  const finalRaw = final ? final.url : null;
  const expectedMasked = maskUrl(opts.expected);
  const reached = !!final && final.status === 200 && finalRaw!.startsWith(expectedMasked.replace(/•+$/, ''));
  let verdict: string;
  const first = hops[0];
  if (dns.resolves === false) {
    verdict = `${dns.host} does not exist in DNS (${dns.detail}), so nobody can open this link. ${BREVO_TRACKING.test(dns.host) ? '' : `It is Brevo's branded click-tracking host: add the DNS record Brevo shows for it (a CNAME, "DNS only", not proxied), or remove the branded tracking domain in Brevo so links use Brevo's own tracking domain.`}`.trim();
  } else if (first?.error) {
    verdict = `Opening ${first.host} failed: ${first.error}. ${/certificate|SSL|TLS/i.test(first.error) ? 'The tracking host has no valid certificate for this name; in Brevo, check that the branded tracking domain is verified, and in DNS that its record is not proxied.' : ''}`.trim();
  } else if (reached) {
    verdict = `The link reaches ${finalRaw}: email links work.`;
  } else if (final) {
    verdict = `The link ends at ${finalRaw} (status ${final.status}), not at ${expectedMasked}.`;
  } else {
    verdict = `The link did not reach a page${last?.error ? `: ${last.error}` : ''}.`;
  }
  return { ok: reached, verdict, dns, hops, finalUrl: finalRaw };
}
