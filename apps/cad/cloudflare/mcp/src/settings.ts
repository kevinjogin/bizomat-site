// What the Worker tells CAD Automation's server when it starts the container, and how it hands requests on.
// Kept apart from index.ts (which needs the Workers runtime) so the tests run on Node.

import { PERSIST_HOST } from './persist';

/**
 * Worker variables and secrets passed to the server as they are (wrangler.jsonc "vars", --var at deploy, and
 * `wrangler secret put`). The secrets are the ones a Fly server may have been given (fly secrets list -a cados): when
 * one is set there, the same value must be set here, or the server on Cloudflare behaves differently with the same
 * data folder:
 * - OPENSKETCH_PASSWORD (no page asks for it any more) or OPENSKETCH_MCP_TOKEN: the seed of the owner's server-wide
 *   private address and of the upload and download link signatures (opensketch/auth.py _base_secret, mcp_token);
 * - OPENSKETCH_KEY_SECRET: the key of the stored Google client secret (opensketch/secretbox.py);
 * - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET: Google sign-in set on the server rather than on the Admin page;
 * - OPENSKETCH_ADDIN_URL: where the add-in update message points.
 * tools/laptop/cloudflare.ps1 secrets mcp copies them from the Fly Machine without showing them.
 */
export const PASSED = [
  'OPENSKETCH_PUBLIC_URL',
  'OPENSKETCH_MCP_URL',
  'OPENSKETCH_REDIRECT_HOSTS',
  'OPENSKETCH_ALIAS_HOSTS',
  'OPENSKETCH_ACCESS_CODE',
  'OPENSKETCH_INSTALLER_URL',
  'OPENSKETCH_VERSION',
  'OPENSKETCH_ADDIN_URL',
  'OPENSKETCH_PASSWORD',
  'OPENSKETCH_MCP_TOKEN',
  'OPENSKETCH_KEY_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
] as const;

/** The secrets above that a Fly server may have: cloudflare.ps1 secrets mcp copies the ones set there. */
export const FROM_FLY = ['OPENSKETCH_PASSWORD', 'OPENSKETCH_MCP_TOKEN', 'OPENSKETCH_KEY_SECRET', 'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET', 'OPENSKETCH_ACCESS_CODE', 'OPENSKETCH_INSTALLER_URL', 'OPENSKETCH_ADDIN_URL'] as const;

/** The server's environment inside the container. */
export function serverEnv(env: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {
    OPENSKETCH_DATA: '/data',
    // the data folder lives in R2 (opensketch/persist.py); the server does not start without its accounts there
    OPENSKETCH_PERSIST_URL: `http://${PERSIST_HOST}`,
    // only this Worker reaches the container, and Cloudflare's edge sets CF-Connecting-IP on every request
    OPENSKETCH_CLIENT_IP_HEADER: 'cf-connecting-ip',
  };
  for (const k of PASSED) {
    const v = env[k];
    if (typeof v === 'string' && v.trim()) out[k] = v.trim();
  }
  return out;
}

/**
 * The request as the server should see it. The Worker states the scheme and host the visitor used (the request's own
 * URL: https://mcp.bizomat.ai/..., or https://bizomat.ai/cad/... from the website Worker), replacing whatever a client
 * sent, because the server builds its OAuth addresses, cookie flags and same-site checks from them (opensketch/auth.py
 * public_url, _secure, _request_base, the Origin check; mcpauth.py base_url).
 */
export function forServer(request: Request): Request {
  const url = new URL(request.url);
  const headers = new Headers(request.headers);
  headers.set('x-forwarded-proto', url.protocol === 'https:' ? 'https' : 'http');
  headers.set('x-forwarded-host', url.host);
  return new Request(request, { headers });
}

/**
 * CAD_PAUSED=1 (a Worker secret: `wrangler secret put CAD_PAUSED`, removed with `wrangler secret delete CAD_PAUSED`):
 * every path but the Worker's health answers 503 and a running server is stopped (SIGTERM, so it copies its last
 * changes to R2 first). Nothing writes to R2 while a new copy of the data is put there (tools/laptop/cloudflare.ps1
 * move cad -Replace).
 */
export const isPaused = (env: { CAD_PAUSED?: unknown }): boolean => typeof env.CAD_PAUSED === 'string' && env.CAD_PAUSED.trim() === '1';
export const PAUSED_DETAIL = 'paused for maintenance';

/** The Worker's own health answer, without starting the container (monitoring and the laptop's checks). */
export const WORKER_HEALTH = '/__worker/health';

/** What a visitor gets while the container cannot be started (a deploy in progress, or no data in R2 yet). */
export function unavailable(detail: string): Response {
  return new Response(
    JSON.stringify({ error: 'CAD Automation is starting or unavailable. Try again in a minute.', detail }),
    { status: 503, headers: { 'content-type': 'application/json', 'retry-after': '30', 'cache-control': 'no-store' } },
  );
}
