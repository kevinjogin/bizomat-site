// The platform's paths, apart from src/worker.ts: the Workers runtime takes every named export of a Worker's main module
// for an entrypoint (a handler or a class), and refuses to start a Worker that exports a plain value there
// ("Incorrect type for map entry 'PLATFORM_HOST'"). src/worker.ts exports only its handler and types.

/** The BIZOMAT platform's address: the website at the root, each application under a path of its own. */
export const PLATFORM_HOST = 'bizomat.ai';

/**
 * Paths of bizomat.ai that belong to CAD Automation. They go to the Worker bizomat-mcp (the CAD binding), or, where it
 * is not bound, to the origin of the bizomat.ai record (the CAD app on Fly) with fetch(request); either way the app
 * answers with its own headers. Besides /cad/... it owns:
 * - the OAuth metadata, which RFC 9728 and RFC 8414 put at the root of the host
 *   (/.well-known/oauth-protected-resource/cad/mcp, /.well-known/oauth-authorization-server/cad);
 * - the addresses programs call at the root, kept for connectors and computers set up while CAD answered there:
 *   the MCP endpoints and the add-in's link (/mcp, /mcp/..., /solidworks/mcp), OAuth (/oauth/...), the Companion's
 *   API (/v2/...) and /healthz;
 * - /.well-known/acme-challenge/..., so Fly can renew the certificate that Cloudflare checks when it connects (always
 *   the origin, see fetch below).
 * The website has none of these paths. The CAD app's list: apps/cad/opensketch/canonical.py (KEEP_PREFIXES).
 */
export const CAD_PATHS = /^\/cad(?:\/|$)|^\/(?:mcp|solidworks\/mcp)(?:\/|$)|^\/oauth\/|^\/v2\/|^\/healthz$|^\/\.well-known\/(?:oauth-protected-resource|oauth-authorization-server|openid-configuration|acme-challenge)(?:\/|$)/;

/**
 * Website sections retired on 8 Nov 2026: the site keeps Home, CAD Automation, Work (Project Management) and The
 * Engine Room. Their pages are gone, and every old address answers 301 with the retained page that replaces it:
 * public/_redirects on Cloudflare, and the Worker for anything those rules cannot match (for example a missing trailing
 * slash) and on Node. None of these is an application's path (tests/worker.test.ts).
 */
const RETIRED: readonly [RegExp, string][] = [
  [/^\/(?:resources|tools|reados|library|insights|learning|search|chat|products|solutions|industries)(?:\/|$)|^\/rss\.xml$/, '/'],
  [/^\/(?:services|how-it-works|factory-fix)(?:\/|$)/, '/engine-room/'],
  [/^\/assessment(?:\/|$)/, '/contact/'],
];

/** Where a retired address now goes, or null when the path is not retired. */
export function retiredTarget(pathname: string): string | null {
  for (const [re, to] of RETIRED) if (re.test(pathname)) return to;
  return null;
}
