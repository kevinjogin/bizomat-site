// The BIZOMAT website on Node.js: the built static site (dist/) plus the site's API routes, served by the SAME Worker
// code as on Cloudflare (src/worker.ts), with Node versions of its bindings (src/node/assets.ts, src/node/bindings.ts).
// This is the "web" process of the single BIZOMAT Fly.io app (infrastructure/fly/), behind the platform proxy.
//
//   npm run build && npm run build:server      dist/ and dist-server/server.mjs
//   node dist-server/server.mjs                 PORT (8003), HOST (::), WEB_DIST_DIR (dist), WEB_TRUST_PROXY ("1")
//
// Optional: TURNSTILE_SECRET_KEY and the contact mail settings (MAIL_PROVIDER, RESEND_API_KEY, CONTACT_TO,
// CONTACT_FROM), WEB_VERSION. GET /healthz answers without touching the Worker.
import { realpathSync } from 'node:fs';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { pathToFileURL } from 'node:url';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import worker, { type Env } from '../worker.ts';
import { createAssets } from './assets.ts';
import { memoryLimiter } from './bindings.ts';

export interface WebServerOptions {
  port?: number;
  host?: string;
  distDir?: string;
  trustProxy?: boolean;
  env?: Record<string, string | undefined>;
  log?: (line: Record<string, unknown>) => void;
}

const MAX_BODY = 1024 * 1024; // the site's own API routes read at most a few tens of kilobytes

/** Build the Worker's env from process settings: only the names the site's code reads are passed through. */
export function buildEnv(distDir: string, settings: Record<string, string | undefined>): Env {
  const env: Record<string, unknown> = {
    ASSETS: createAssets({ dir: distDir }),
    FORM_LIMITER: memoryLimiter(5, 60),
  };
  for (const name of ['TURNSTILE_SECRET_KEY', 'RATE_LIMIT_MAX', 'RATE_LIMIT_WINDOW', 'MAIL_PROVIDER', 'RESEND_API_KEY', 'CONTACT_TO', 'CONTACT_FROM']) {
    if (settings[name]) env[name] = settings[name];
  }
  return env as unknown as Env;
}

/** The first address in a header value, if it looks like an IP address. */
const firstIp = (value: string | undefined) => {
  const ip = (value ?? '').split(',')[0].trim();
  return /^[0-9a-f:.]{2,45}$/i.test(ip) ? ip : '';
};

export function toRequest(req: IncomingMessage, trustProxy: boolean): Request {
  const proto = trustProxy && req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const host = (trustProxy && typeof req.headers['x-forwarded-host'] === 'string' ? req.headers['x-forwarded-host'] : req.headers.host) ?? 'localhost';
  const safeHost = /^[a-z0-9.\-:[\]]+$/i.test(host) ? host : 'localhost';
  const url = new URL(req.url ?? '/', `${proto}://${safeHost}`);
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v === undefined || k.startsWith(':')) continue;
    for (const one of Array.isArray(v) ? v : [v]) headers.append(k, one);
  }
  // The client address the site's rate limits use. Behind the platform proxy it is set by the proxy (from Fly's edge);
  // otherwise any client-supplied value is replaced by the socket address, so it cannot be spoofed.
  const fromProxy = trustProxy ? firstIp(req.headers['cf-connecting-ip'] as string) || firstIp(req.headers['x-forwarded-for'] as string) : '';
  headers.set('CF-Connecting-IP', fromProxy || req.socket.remoteAddress || 'unknown');
  const method = (req.method ?? 'GET').toUpperCase();
  let size = 0;
  const body = method === 'GET' || method === 'HEAD' ? undefined : (Readable.toWeb(req.on('data', (chunk: Buffer) => {
    size += chunk.length;
    if (size > MAX_BODY) req.destroy(new Error('body too large'));
  })) as ReadableStream);
  return new Request(url, { method, headers, body, duplex: 'half' } as RequestInit);
}

async function send(res: ServerResponse, response: Response, method: string) {
  const headers: Record<string, string | string[]> = {};
  response.headers.forEach((value, key) => {
    if (key === 'set-cookie') return;
    headers[key] = value;
  });
  const cookies = response.headers.getSetCookie?.() ?? [];
  if (cookies.length) headers['set-cookie'] = cookies;
  res.writeHead(response.status, headers);
  if (!response.body || method === 'HEAD') { res.end(); return; }
  await pipeline(Readable.fromWeb(response.body as import('node:stream/web').ReadableStream), res);
}

export function startWebServer(options: WebServerOptions = {}) {
  const settings = options.env ?? process.env;
  const distDir = options.distDir ?? settings.WEB_DIST_DIR ?? 'dist';
  const trustProxy = options.trustProxy ?? settings.WEB_TRUST_PROXY === '1';
  const version = settings.WEB_VERSION || 'dev';
  const env = buildEnv(distDir, settings);
  const log = options.log ?? ((line) => console.log(JSON.stringify(line)));
  const inFlight = new Set<Promise<unknown>>();

  const server = createServer((req, res) => {
    const started = performance.now();
    const path = (req.url ?? '/').split('?')[0];
    const done = (status: number) => log({ web: 'request', method: req.method, path: path.slice(0, 200), status, ms: Math.round(performance.now() - started) });
    if (path === '/healthz') {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ status: 'ok', service: 'web', version }));
      done(200);
      return;
    }
    const task = (async () => {
      try {
        const response = await worker.fetch(toRequest(req, trustProxy), env);
        await send(res, response, req.method ?? 'GET');
        done(response.status);
      } catch (err) {
        log({ web: 'error', path: path.slice(0, 200), error: String(err).slice(0, 200) });
        if (!res.headersSent) { res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Something went wrong.'); } else res.destroy();
        done(500);
      }
    })();
    inFlight.add(task);
    task.finally(() => inFlight.delete(task));
  });
  server.headersTimeout = 60_000;
  server.requestTimeout = 120_000;
  server.keepAliveTimeout = 75_000;

  const port = options.port ?? Number(settings.PORT || 8003);
  const host = options.host ?? settings.HOST ?? '::';
  // '::' accepts IPv6 and IPv4 (Fly's private network is IPv6). Where IPv6 is unavailable, fall back to IPv4.
  const ready = new Promise<number>((resolve, reject) => {
    const listen = (h: string) => server.listen(port, h, () => resolve((server.address() as { port: number }).port));
    server.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EAFNOSUPPORT' && host === '::') { log({ web: 'ipv6-unavailable', fallback: '0.0.0.0' }); listen('0.0.0.0'); } else reject(err);
    });
    listen(host);
  });
  const close = async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await Promise.race([Promise.allSettled([...inFlight]), new Promise((r) => setTimeout(r, 10_000))]);
  };
  return { server, ready, close };
}

// Run directly: node dist-server/server.mjs. Only when this file is the script node was started with: the platform proxy
// also imports this bundle to host the website in its own process (infrastructure/proxy/server.mjs, PROXY_EMBED_WEB),
// and its entry file is also called server.mjs, so the check compares the whole path, not the name.
const entry = process.argv[1] ?? '';
let isMain = false;
try {
  isMain = Boolean(entry) && import.meta.url === pathToFileURL(realpathSync(entry)).href;
} catch {
  isMain = false;
}
if (isMain) {
  const { ready, close } = startWebServer();
  ready.then((port) => console.log(JSON.stringify({ web: 'listening', port })));
  for (const signal of ['SIGTERM', 'SIGINT'] as const) {
    process.on(signal, () => { close().then(() => process.exit(0), () => process.exit(1)); });
  }
}
