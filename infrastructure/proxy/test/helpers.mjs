// Test helpers: fake backends, a raw HTTP client that sets any Host header, a minimal WebSocket client and server.

import http from 'node:http';
import net from 'node:net';
import { createHash } from 'node:crypto';
import { loadConfig } from '../config.mjs';
import { createProxy, listen } from '../proxy.mjs';

const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC11B65';

export function wsAccept(key) {
  return createHash('sha1').update(key + WS_GUID).digest('base64');
}

/** One unmasked (server) or masked (client) WebSocket text frame, payload < 126 bytes. */
export function wsFrame(text, masked) {
  const payload = Buffer.from(text);
  if (payload.length > 125) throw new Error('test frames are small');
  if (!masked) return Buffer.concat([Buffer.from([0x81, payload.length]), payload]);
  const mask = Buffer.from([1, 2, 3, 4]);
  const body = Buffer.from(payload.map((b, i) => b ^ mask[i % 4]));
  return Buffer.concat([Buffer.from([0x81, 0x80 | payload.length]), mask, body]);
}

export function wsParse(buf) {
  if (buf.length < 2) return null;
  const masked = (buf[1] & 0x80) !== 0;
  const len = buf[1] & 0x7f;
  const start = 2 + (masked ? 4 : 0);
  if (buf.length < start + len) return null;
  let payload = buf.subarray(start, start + len);
  if (masked) {
    const mask = buf.subarray(2, 6);
    payload = Buffer.from(payload.map((b, i) => b ^ mask[i % 4]));
  }
  return { opcode: buf[0] & 0x0f, text: payload.toString(), rest: buf.subarray(start + len) };
}

/**
 * A fake backend. Paths:
 *   /healthz, /api/health   200 {"ok":true}
 *   /stream                 chunked: "one\n" now, "two\n" after 300 ms, "three\n" after 600 ms
 *   /slow?ms=N              answers after N ms
 *   /upload                 reads the body, answers {bytes}
 *   /hop                    answers with hop-by-hop headers and two Set-Cookie
 *   /hsts                   answers with its own Strict-Transport-Security
 *   anything else           echoes {name, method, url, headers}
 * Upgrades: /ws echoes WebSocket frames; /ws-deny answers 401.
 */
export async function startUpstream(name, { onBodyChunk } = {}) {
  const seen = [];
  const sockets = new Set();
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://upstream');
    seen.push({ method: req.method, url: req.url, headers: req.headers, rawHeaders: req.rawHeaders });
    const json = (status, body, headers = {}) => {
      const b = JSON.stringify(body);
      res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(b), ...headers });
      res.end(b);
    };
    if (url.pathname === '/healthz' || url.pathname === '/api/health') return json(200, { ok: true, name });
    if (url.pathname === '/stream') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write('one\n');
      setTimeout(() => res.write('two\n'), 300);
      setTimeout(() => res.end('three\n'), 600);
      return undefined;
    }
    if (url.pathname === '/slow') {
      const ms = Number(url.searchParams.get('ms') || 1000);
      const timer = setTimeout(() => json(200, { name, waited: ms }), ms);
      res.on('close', () => clearTimeout(timer));
      return undefined;
    }
    if (url.pathname === '/upload') {
      let bytes = 0;
      req.on('data', (chunk) => {
        bytes += chunk.length;
        if (onBodyChunk) onBodyChunk(chunk, bytes);
      });
      req.on('end', () => json(200, { name, bytes }));
      return undefined;
    }
    if (url.pathname === '/hop') {
      res.writeHead(200, [
        'Content-Type', 'text/plain',
        'Connection', 'close, X-Up-Hop',
        'X-Up-Hop', 'private',
        'Keep-Alive', 'timeout=5',
        'Set-Cookie', 'a=1; Path=/',
        'Set-Cookie', 'b=2; Path=/',
      ]);
      res.end('hop');
      return undefined;
    }
    if (url.pathname === '/hsts') {
      res.writeHead(200, { 'Strict-Transport-Security': 'max-age=60', 'Content-Type': 'text/plain' });
      res.end('own');
      return undefined;
    }
    return json(200, { name, method: req.method, url: req.url, headers: req.headers, rawHeaders: req.rawHeaders });
  });
  server.on('connection', (s) => {
    sockets.add(s);
    s.on('close', () => sockets.delete(s));
  });
  server.on('upgrade', (req, socket) => {
    seen.push({ method: req.method, url: req.url, headers: req.headers, rawHeaders: req.rawHeaders, upgrade: true });
    socket.on('error', () => {});
    if (req.url.startsWith('/ws-deny')) {
      const body = '{"error":"Authentication required"}';
      socket.end(`HTTP/1.1 401 Unauthorized\r\nContent-Type: application/json\r\nContent-Length: ${body.length}\r\n\r\n${body}`);
      return;
    }
    socket.write([
      'HTTP/1.1 101 Switching Protocols', 'Upgrade: websocket', 'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${wsAccept(req.headers['sec-websocket-key'])}`, `X-Upstream: ${name}`, '', '',
    ].join('\r\n'));
    let buf = Buffer.alloc(0);
    socket.on('data', (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      for (let f = wsParse(buf); f; f = wsParse(buf)) {
        buf = f.rest;
        if (f.opcode === 0x8) {
          socket.end();
          return;
        }
        socket.write(wsFrame(`${name}:${f.text}`, false));
      }
    });
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  return {
    name,
    port,
    url: `http://127.0.0.1:${port}`,
    seen,
    server,
    close: () => new Promise((r) => {
      for (const s of sockets) s.destroy();
      server.close(() => r());
    }),
  };
}

/** A port nothing listens on. */
export async function deadPort() {
  const s = net.createServer();
  await new Promise((r) => s.listen(0, '127.0.0.1', r));
  const { port } = s.address();
  await new Promise((r) => s.close(r));
  return port;
}

/** Start the proxy in front of the given backends. Returns {port, logs, proxy, close}. */
export async function startProxy(urls, env = {}, { resolve } = {}) {
  const config = loadConfig({
    UPSTREAM_WEB: urls.web,
    UPSTREAM_WORK: urls.work,
    UPSTREAM_CAD: urls.cad,
    PROXY_DNS_TTL_MS: '1000',
    PROXY_SHUTDOWN_GRACE_MS: '2000',
    ...env,
  });
  const logs = [];
  const proxy = createProxy(config, { log: (e) => logs.push(e), resolve });
  const addr = await listen(proxy.server, 0, '127.0.0.1');
  return { port: addr.port, logs, proxy, config, close: () => proxy.close() };
}

/**
 * One request to 127.0.0.1:port with an explicit Host header (and no agent: a fresh connection).
 * Resolves {status, headers, rawHeaders, body (Buffer), text, json()}.
 */
export function request(port, { host, method = 'GET', path = '/', headers = {}, body, rawHeaders } = {}) {
  return new Promise((resolve, reject) => {
    const hdrs = rawHeaders ? [...rawHeaders] : [];
    if (!rawHeaders) {
      if (host !== undefined) hdrs.push('Host', host);
      for (const [k, v] of Object.entries(headers)) {
        if (Array.isArray(v)) for (const one of v) hdrs.push(k, one);
        else hdrs.push(k, v);
      }
    }
    const req = http.request({ host: '127.0.0.1', port, method, path, headers: hdrs, setHost: false, agent: false });
    req.on('response', (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        resolve({
          status: res.statusCode,
          headers: res.headers,
          rawHeaders: res.rawHeaders,
          body: buf,
          text: buf.toString(),
          json: () => JSON.parse(buf.toString()),
        });
      });
      res.on('error', reject);
    });
    req.on('error', reject);
    if (body !== undefined) req.end(body);
    else req.end();
  });
}

/** Open a WebSocket through the proxy with a raw socket. Resolves {socket, status, head (string), rest (Buffer)}. */
export function wsOpen(port, { host, path = '/ws', headers = {} }) {
  return new Promise((resolve, reject) => {
    const key = Buffer.from('0123456789abcdef').toString('base64');
    const socket = net.connect(port, '127.0.0.1');
    const lines = [`GET ${path} HTTP/1.1`, `Host: ${host}`, 'Upgrade: websocket', 'Connection: Upgrade',
      `Sec-WebSocket-Key: ${key}`, 'Sec-WebSocket-Version: 13'];
    for (const [k, v] of Object.entries(headers)) lines.push(`${k}: ${v}`);
    socket.write(`${lines.join('\r\n')}\r\n\r\n`);
    let buf = Buffer.alloc(0);
    const onData = (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      const end = buf.indexOf('\r\n\r\n');
      if (end < 0) return;
      socket.removeListener('data', onData);
      const head = buf.subarray(0, end).toString('latin1');
      const status = Number(head.split(' ')[1]);
      resolve({ socket, status, head, rest: buf.subarray(end + 4), key });
    };
    socket.on('data', onData);
    socket.on('error', reject);
  });
}

/** Read one WebSocket frame from a socket (after wsOpen). */
export function wsRead(socket, initial = Buffer.alloc(0)) {
  return new Promise((resolve, reject) => {
    let buf = initial;
    const tryParse = () => {
      const f = wsParse(buf);
      if (f) {
        socket.removeListener('data', onData);
        resolve(f);
        return true;
      }
      return false;
    };
    const onData = (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      tryParse();
    };
    if (tryParse()) return;
    socket.on('data', onData);
    socket.once('error', reject);
  });
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
