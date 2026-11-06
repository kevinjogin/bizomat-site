// BIZOMAT edge proxy: settings from the environment (the entrypoint passes only these to the proxy role).
//
//   PORT / PROXY_PORT            listen port (8080, the fly.toml http_service internal_port)
//   PROXY_HOST                   listen address ('::', all interfaces, IPv6 and IPv4; falls back to 0.0.0.0)
//   UPSTREAM_WEB                 http://web.process.bizomat.internal:8003
//   UPSTREAM_WORK                http://work.process.bizomat.internal:8002
//   UPSTREAM_CAD                 http://cad.process.bizomat.internal:8001
//   BIZOMAT_PREVIEW_ROUTING      "1": the /__preview/* switch and its cookie work on *.fly.dev
//   PROXY_CLIENT_IP_MODE         fly | socket (default: fly when FLY_APP_NAME is set, else socket); see headers.mjs
//   PROXY_UNTRUSTED_PEERS        CIDRs never treated as Fly's edge (default fdaa::/16, the private network)
//   PROXY_TRUST_CLOUDFLARE       "1": trust CF-Connecting-IP from Cloudflare's ranges (orange-cloud DNS only)
//   PROXY_ASSUME_HTTPS           "1" (socket mode only): requests are reported to the backends as https, as Fly's TLS
//                                edge would; for the local stack, which has no TLS in front. Never trusts the client.
//   PROXY_CLOUDFLARE_RANGES      replaces the built-in Cloudflare ranges (comma separated)
//   PROXY_IDLE_TIMEOUT_MS        a request, response or WebSocket with no bytes for this long is closed (620000)
//   PROXY_HEADERS_TIMEOUT_MS     time to receive a request's headers (60000)
//   PROXY_REQUEST_TIMEOUT_MS     time to receive a whole request, body included (3600000: big uploads)
//   PROXY_KEEPALIVE_TIMEOUT_MS   idle keep-alive connection from the edge (75000)
//   PROXY_SHUTDOWN_GRACE_MS      on SIGTERM, time open requests get to finish (10000; fly.toml kill_timeout is 15 s)
//   PROXY_DNS_TTL_MS             how long a backend lookup is used (5000)
//   PROXY_LOG                    "0" turns the per-request log lines off
//   BIZOMAT_VERSION              shown by /__proxy/health

import { CLOUDFLARE_RANGES, SIX_PN, cidrList } from './headers.mjs';

export const DEFAULT_UPSTREAMS = Object.freeze({
  web: 'http://web.process.bizomat.internal:8003',
  work: 'http://work.process.bizomat.internal:8002',
  cad: 'http://cad.process.bizomat.internal:8001',
});

function int(value, fallback, name) {
  if (value === undefined || value === '') return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) throw new Error(`${name} must be a whole number of milliseconds (got ${value})`);
  return n;
}

function list(value) {
  return String(value || '').split(',').map((s) => s.trim()).filter(Boolean);
}

export function loadConfig(env = process.env) {
  const mode = env.PROXY_CLIENT_IP_MODE || (env.FLY_APP_NAME ? 'fly' : 'socket');
  if (mode !== 'fly' && mode !== 'socket') throw new Error(`PROXY_CLIENT_IP_MODE must be fly or socket (got ${mode})`);
  const port = int(env.PROXY_PORT || env.PORT, 8080, 'PROXY_PORT');
  if (port < 1 || port > 65535) throw new Error(`PROXY_PORT out of range: ${port}`);
  return {
    port,
    host: env.PROXY_HOST || '::',
    upstreams: {
      web: env.UPSTREAM_WEB || DEFAULT_UPSTREAMS.web,
      work: env.UPSTREAM_WORK || DEFAULT_UPSTREAMS.work,
      cad: env.UPSTREAM_CAD || DEFAULT_UPSTREAMS.cad,
    },
    previewRouting: env.BIZOMAT_PREVIEW_ROUTING === '1',
    trust: {
      mode,
      untrusted: cidrList(env.PROXY_UNTRUSTED_PEERS !== undefined ? list(env.PROXY_UNTRUSTED_PEERS) : SIX_PN),
      cloudflare: env.PROXY_TRUST_CLOUDFLARE === '1',
      assumeHttps: mode === 'socket' && env.PROXY_ASSUME_HTTPS === '1',
      cloudflareRanges: cidrList(env.PROXY_CLOUDFLARE_RANGES ? list(env.PROXY_CLOUDFLARE_RANGES) : CLOUDFLARE_RANGES),
    },
    idleTimeoutMs: int(env.PROXY_IDLE_TIMEOUT_MS, 620_000, 'PROXY_IDLE_TIMEOUT_MS'),
    headersTimeoutMs: int(env.PROXY_HEADERS_TIMEOUT_MS, 60_000, 'PROXY_HEADERS_TIMEOUT_MS'),
    requestTimeoutMs: int(env.PROXY_REQUEST_TIMEOUT_MS, 3_600_000, 'PROXY_REQUEST_TIMEOUT_MS'),
    keepAliveTimeoutMs: int(env.PROXY_KEEPALIVE_TIMEOUT_MS, 75_000, 'PROXY_KEEPALIVE_TIMEOUT_MS'),
    shutdownGraceMs: int(env.PROXY_SHUTDOWN_GRACE_MS, 10_000, 'PROXY_SHUTDOWN_GRACE_MS'),
    dnsTtlMs: int(env.PROXY_DNS_TTL_MS, 5_000, 'PROXY_DNS_TTL_MS'),
    logRequests: env.PROXY_LOG !== '0',
    version: env.BIZOMAT_VERSION || 'dev',
  };
}
