// Node HTTP <-> Fetch API for the Worker.
//
// URL: scheme and host come from X-Forwarded-Proto / X-Forwarded-Host only
// when WORK_TRUST_PROXY=1 (the platform proxy sets them); otherwise from the
// socket and the Host header. The path is set on a URL whose host is already
// fixed, so a request line like "GET //evil.example/x" cannot change the host
// the Worker sees (its Origin and CSRF checks compare against that host).
//
// Client IP: the Worker reads CF-Connecting-IP, then X-Forwarded-For. With
// WORK_TRUST_PROXY=1, CF-Connecting-IP set by the platform proxy is kept (if
// it is missing, the last X-Forwarded-For hop or the socket address is used).
// Otherwise every client-supplied address header is removed and both headers
// are set from the socket address, so a client cannot spoof its address.
//
// Bodies are streamed in both directions. Request bodies above
// maxBodyBytes are refused with 413 (by Content-Length before the Worker runs,
// or as soon as a streamed body passes the limit).

import type { IncomingMessage, ServerResponse } from 'node:http';
import { TLSSocket } from 'node:tls';

const DROP_HEADERS = ['connection', 'keep-alive', 'proxy-connection', 'transfer-encoding', 'te', 'trailer', 'http2-settings'];
const ADDRESS_HEADERS = ['cf-connecting-ip', 'cf-connecting-ipv6', 'x-forwarded-for', 'x-real-ip', 'true-client-ip', 'forwarded'];
const PROXY_HEADERS = ['x-forwarded-host', 'x-forwarded-proto', 'x-forwarded-port'];
const HOST_RE = /^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.?|\[[0-9A-Fa-f:.]+\])(?::\d{1,5})?$/;

export class HttpProblem extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export interface BridgeOptions {
  trustProxy: boolean;
  maxBodyBytes: number;
}

export interface BodyState {
  tooLarge: boolean;
}

/** Socket address without the IPv4-mapped IPv6 prefix. */
export function socketAddress(req: IncomingMessage): string {
  const a = req.socket.remoteAddress ?? '';
  return a.startsWith('::ffff:') && a.includes('.') ? a.slice(7) : a || 'unknown';
}

function first(v: string | string[] | undefined): string | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  return s?.split(',')[0]?.trim() || undefined;
}

export function requestUrl(req: IncomingMessage, trustProxy: boolean): URL {
  let proto = req.socket instanceof TLSSocket && req.socket.encrypted ? 'https' : 'http';
  let host = typeof req.headers.host === 'string' ? req.headers.host.trim() : '';
  if (trustProxy) {
    const p = first(req.headers['x-forwarded-proto'])?.toLowerCase();
    if (p === 'http' || p === 'https') proto = p;
    const h = first(req.headers['x-forwarded-host']);
    if (h) host = h;
  }
  if (!host || !HOST_RE.test(host)) throw new HttpProblem(400, 'Missing or invalid Host header');
  let target = req.url ?? '/';
  if (!target.startsWith('/')) {
    if (target === '*') target = '/';
    else {
      try {
        const abs = new URL(target);
        target = abs.pathname + abs.search;
      } catch {
        throw new HttpProblem(400, 'Invalid request target');
      }
    }
  }
  const url = new URL(`${proto}://${host}`);
  const q = target.indexOf('?');
  url.pathname = q < 0 ? target : target.slice(0, q);
  url.search = q < 0 ? '' : target.slice(q);
  return url;
}

export function requestHeaders(req: IncomingMessage, trustProxy: boolean): Headers {
  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (value === undefined || DROP_HEADERS.includes(name)) continue;
    if (Array.isArray(value)) for (const v of value) headers.append(name, v);
    else headers.set(name, value);
  }
  const socket = socketAddress(req);
  if (trustProxy) {
    if (!headers.get('cf-connecting-ip')) {
      const hops = (headers.get('x-forwarded-for') ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      headers.set('cf-connecting-ip', hops[hops.length - 1] ?? socket);
    }
  } else {
    for (const h of [...ADDRESS_HEADERS, ...PROXY_HEADERS]) headers.delete(h);
    headers.set('cf-connecting-ip', socket);
    headers.set('x-forwarded-for', socket);
  }
  return headers;
}

/** A web stream over the request body that stops at maxBytes. */
function requestBody(req: IncomingMessage, maxBytes: number, state: BodyState): ReadableStream<Uint8Array> {
  let received = 0;
  let done = false;
  return new ReadableStream<Uint8Array>({
    start(controller) {
      req.on('data', (chunk: Buffer) => {
        if (done) return;
        received += chunk.length;
        if (received > maxBytes) {
          done = true;
          state.tooLarge = true;
          controller.error(new HttpProblem(413, 'Request body is too large'));
          req.resume();
          return;
        }
        controller.enqueue(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength));
        if ((controller.desiredSize ?? 1) <= 0) req.pause();
      });
      req.on('end', () => {
        if (done) return;
        done = true;
        controller.close();
      });
      req.on('error', (e) => {
        if (done) return;
        done = true;
        controller.error(e);
      });
    },
    pull() {
      req.resume();
    },
    cancel() {
      done = true;
      req.resume();
    },
  });
}

export function toFetchRequest(req: IncomingMessage, opts: BridgeOptions, signal?: AbortSignal): { request: Request; url: URL; body: BodyState } {
  const url = requestUrl(req, opts.trustProxy);
  const headers = requestHeaders(req, opts.trustProxy);
  const method = (req.method ?? 'GET').toUpperCase();
  const state: BodyState = { tooLarge: false };
  const init: RequestInit & { duplex?: 'half' } = { method, headers, signal, redirect: 'manual' };
  if (method !== 'GET' && method !== 'HEAD') {
    const declared = Number(req.headers['content-length']);
    if (Number.isFinite(declared) && declared > opts.maxBodyBytes) throw new HttpProblem(413, 'Request body is too large');
    const chunked = req.headers['transfer-encoding'] !== undefined;
    if (chunked || (Number.isFinite(declared) && declared > 0)) {
      init.body = requestBody(req, opts.maxBodyBytes, state);
      init.duplex = 'half';
    }
  }
  return { request: new Request(url, init), url, body: state };
}

/** Writes a Fetch Response to a Node response, streaming the body and honouring backpressure. */
export async function writeResponse(res: ServerResponse, response: Response, method: string): Promise<void> {
  const headers: Record<string, string | string[]> = {};
  response.headers.forEach((value, name) => {
    if (name !== 'set-cookie') headers[name] = value;
  });
  const cookies = response.headers.getSetCookie();
  if (cookies.length) headers['set-cookie'] = cookies;
  const status = response.status;
  const noBody = method === 'HEAD' || status === 204 || status === 304 || (status >= 100 && status < 200);
  if (noBody && response.body) await response.body.cancel().catch(() => {});
  if (res.destroyed) return;
  res.writeHead(status, response.statusText || undefined, headers);
  if (noBody || !response.body) {
    res.end();
    return;
  }
  const reader = response.body.getReader();
  const onClose = () => {
    reader.cancel().catch(() => {});
  };
  res.once('close', onClose);
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (res.destroyed) return;
      if (!res.write(value)) {
        await new Promise<void>((resolve) => {
          const go = () => {
            res.off('drain', go);
            res.off('close', go);
            resolve();
          };
          res.on('drain', go);
          res.on('close', go);
        });
      }
    }
    res.end();
  } catch (e) {
    res.destroy(e as Error);
  } finally {
    res.off('close', onClose);
  }
}

export function problemResponse(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}

const REASONS: Record<number, string> = { 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 413: 'Payload Too Large', 426: 'Upgrade Required', 429: 'Too Many Requests', 500: 'Internal Server Error', 503: 'Service Unavailable' };

/** Writes a complete HTTP/1.1 response on a raw socket (refused WebSocket upgrades), then closes it. */
export async function writeRawResponse(socket: import('node:stream').Duplex, response: Response): Promise<void> {
  const body = Buffer.from(response.body ? await response.arrayBuffer() : new ArrayBuffer(0));
  const lines = [`HTTP/1.1 ${response.status} ${response.statusText || REASONS[response.status] || 'Error'}`];
  response.headers.forEach((value, name) => {
    if (name === 'set-cookie' || name === 'content-length' || name === 'connection' || name === 'transfer-encoding') return;
    lines.push(`${name}: ${value.replace(/[\r\n]/g, ' ')}`);
  });
  for (const c of response.headers.getSetCookie()) lines.push(`set-cookie: ${c.replace(/[\r\n]/g, ' ')}`);
  lines.push(`content-length: ${body.length}`, 'connection: close', '', '');
  if (socket.destroyed) return;
  socket.end(Buffer.concat([Buffer.from(lines.join('\r\n'), 'latin1'), body]));
}
