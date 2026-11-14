// BIZOMAT edge proxy: the HTTP server. Fly's edge sends every request for every BIZOMAT host here; this server
// picks the backend by Host header and, on bizomat.ai, by path (routes.mjs) and passes the request on over the
// private network, streaming both bodies (nothing is buffered: big uploads, long polls, server-sent events and
// WebSockets pass straight through).
//
// Timeouts:
//   - headers: a client gets headersTimeoutMs (60 s) to send its request headers;
//   - idle: a request, a response or an upgraded connection with no bytes in either direction for
//     idleTimeoutMs (620 s, just over Fly's 600 s http_options.idle_timeout) is closed; long polls (25-60 s),
//     MCP tool calls that wait up to 240 s and quiet WebSockets fit inside it;
//   - whole request: requestTimeoutMs (1 h) to receive a request body (large uploads on slow links);
//   - keep-alive: idle connections from the edge are kept keepAliveTimeoutMs (75 s).
// A backend that cannot be reached gets one more try after a fresh DNS lookup, but only when nothing of the
// request has been sent yet (connection refused or reset on a reused socket before any body byte): then 502.
// A backend that stays silent past the idle timeout: 504.

import http from 'node:http';
import net from 'node:net';
import { randomBytes } from 'node:crypto';
import { UPSTREAM_NAMES, PREVIEW_COOKIE, decide, splitTarget, previewCookieHeader, previewNext } from './routes.mjs';
import {
  HSTS_VALUE, clientInfo, clientResponseHeaders, hasRequestBody, readCookie, redactPath, upstreamRequestHeaders,
} from './headers.mjs';
import { errorPage, rawResponse, wantsHtml } from './pages.mjs';
import { Upstream, isConnectError } from './upstreams.mjs';

/** The health endpoint of each backend (their contracts), used by /__proxy/ready. */
export const HEALTH_PATHS = Object.freeze({ web: '/healthz', work: '/api/health', cad: '/healthz' });

const READY_CACHE_MS = 2000;
const HANDSHAKE_TIMEOUT_MS = 30_000;
const STATUS_TEXT = { 301: 'Moved Permanently', 302: 'Found', 303: 'See Other', 307: 'Temporary Redirect', 308: 'Permanent Redirect', 400: 'Bad Request', 404: 'Not Found', 405: 'Method Not Allowed', 421: 'Misdirected Request', 502: 'Bad Gateway', 503: 'Service Unavailable', 504: 'Gateway Timeout' };

export function defaultLog(entry) {
  process.stdout.write(`${JSON.stringify(entry)}\n`);
}

function timeoutError() {
  return Object.assign(new Error('the backend did not answer in time'), { code: 'BZ_UPSTREAM_TIMEOUT' });
}

function errCode(err) {
  return (err && (err.code || err.name)) || 'ERROR';
}

/**
 * Make the proxy server (not yet listening).
 * @param {object} config        loadConfig() output
 * @param {object} [deps]
 * @param {Function} [deps.log]      receives one object per request
 * @param {Function} [deps.resolve]  DNS lookup (tests)
 * @returns {{server: http.Server, upstreams: object, close: () => Promise<void>, stats: () => object}}
 */
/** True when the answer comes from a signed-in application (BIZOMAT ERP and its tools, or CAD Automation): their pages
 * are kept out of search engines (headers.mjs, clientResponseHeaders). The website (web) stays indexable. */
export function isApp(d) {
  return d.upstream === 'work' || d.upstream === 'cad';
}

export function createProxy(config, { log = defaultLog, resolve } = {}) {
  const upstreams = {};
  for (const name of UPSTREAM_NAMES) {
    upstreams[name] = new Upstream(name, config.upstreams[name], { resolve, ttlMs: config.dnsTtlMs });
  }
  const checkEvery = Math.max(50, Math.min(30_000, Math.floor((config.headersTimeoutMs || 60_000) / 2)));
  const server = http.createServer({
    requestTimeout: config.requestTimeoutMs,
    headersTimeout: config.headersTimeoutMs,
    keepAliveTimeout: config.keepAliveTimeoutMs,
    connectionsCheckingInterval: checkEvery,
    noDelay: true,
  });
  // The client side waits a little longer than the backend side, so a silent backend gets its 504 written
  // before the client connection itself counts as idle.
  server.timeout = config.idleTimeoutMs ? config.idleTimeoutMs + 5000 : 0;

  const upgraded = new Set();
  let active = 0;
  let draining = false;
  let closing = null;
  let readyCache = null;
  let readyRunning = null;

  const emit = (entry) => {
    if (config.logRequests === false) return;
    try {
      log(entry);
    } catch {
      // a logger fault never breaks a request
    }
  };

  function finishLog(info, t0) {
    const bare = (info.host || '').replace(/^\[|\]$/g, '');
    const entry = {
      t: new Date().toISOString(),
      // an address used as Host (Fly's checks, direct private-network calls) is logged as "ip", never itself
      host: net.isIP(bare) ? 'ip' : (info.host || '-'),
      method: info.method,
      path: redactPath(info.path),
      status: info.status,
      upstream: info.upstream,
      ms: Math.round(performance.now() - t0),
      id: info.id,
    };
    if (info.upgrade) entry.upgrade = true;
    if (info.aborted) entry.aborted = true;
    if (info.err) entry.err = info.err;
    emit(entry);
  }

  // ------------------------------------------------------------------ answers the proxy writes itself

  function sendPage(res, status, req, { production = false, preview = false, close = false, retryAfter } = {}) {
    if (res.headersSent) {
      res.destroy();
      return;
    }
    const page = errorPage(status, { html: wantsHtml(req.headers.accept), retryAfter });
    const headers = { ...page.headers };
    if (production) headers['Strict-Transport-Security'] = HSTS_VALUE;
    if (preview) headers['X-Robots-Tag'] = 'noindex';
    if (status === 405) headers.Allow = 'GET, HEAD';
    if (close || draining) headers.Connection = 'close';
    res.writeHead(status, headers);
    res.end(req.method === 'HEAD' ? undefined : page.body);
  }

  function sendJson(res, status, req, body, extra = {}) {
    const buf = Buffer.from(`${JSON.stringify(body)}\n`);
    res.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': String(buf.length),
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extra,
    });
    res.end(req.method === 'HEAD' ? undefined : buf);
  }

  function sendRedirect(res, req, d) {
    const body = Buffer.from(`Moved to ${d.location}\n`);
    const headers = {
      Location: d.location,
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Length': String(body.length),
      'Cache-Control': d.temporary ? 'no-store' : 'public, max-age=86400',
    };
    if (d.production) headers['Strict-Transport-Security'] = HSTS_VALUE;
    try {
      res.writeHead(d.status, headers);
    } catch {
      sendPage(res, 400, req);
      return;
    }
    res.end(req.method === 'HEAD' ? undefined : body);
  }

  async function readiness() {
    if (readyCache && Date.now() - readyCache.at < READY_CACHE_MS) return readyCache.value;
    if (!readyRunning) {
      readyRunning = (async () => {
        const entries = await Promise.all(UPSTREAM_NAMES.map(async (n) => [n, await upstreams[n].probe(HEALTH_PATHS[n])]));
        const result = Object.fromEntries(entries);
        const value = { ok: !draining && Object.values(result).every((r) => r.ok), upstreams: result };
        readyCache = { at: Date.now(), value };
        return value;
      })().finally(() => {
        readyRunning = null;
      });
    }
    return readyRunning;
  }

  // ------------------------------------------------------------------ plain HTTP

  function forward(req, res, d, client, info) {
    const up = upstreams[d.upstream];
    const headers = upstreamRequestHeaders(req.rawHeaders, {
      client, host: req.headers.host, requestId: info.id, upgrade: '', dropCookie: d.preview ? PREVIEW_COOKIE : '',
    });
    const body = hasRequestBody(req.headers);
    let current = null;
    let attempts = 0;
    let clientGone = false;

    res.on('close', () => {
      if (!res.writableFinished) {
        clientGone = true;
        info.aborted = true;
        if (current) current.destroy();
      }
    });

    const attempt = () => {
      attempts += 1;
      let connected = false;
      let piping = false;
      let responseDone = false;
      const upReq = http.request(up.requestOptions({ method: req.method, path: req.url, headers, setHost: false }));
      current = upReq;
      upReq.setTimeout(config.idleTimeoutMs, () => upReq.destroy(timeoutError()));
      upReq.on('socket', (socket) => {
        const ready = () => {
          connected = true;
          if (body && !piping && !clientGone) {
            piping = true;
            req.pipe(upReq);
          }
        };
        if (socket.connecting) socket.once('connect', ready);
        else ready();
      });
      if (!body) upReq.end();

      upReq.on('response', (upRes) => {
        if (clientGone) {
          upRes.resume();
          return;
        }
        const out = clientResponseHeaders(upRes.rawHeaders, { production: d.production, preview: d.preview, app: isApp(d) });
        try {
          if (draining) res.shouldKeepAlive = false;
          res.writeHead(upRes.statusCode, upRes.statusMessage, out);
        } catch {
          info.err = 'BAD_UPSTREAM_HEADERS';
          upRes.resume();
          sendPage(res, 502, req, { production: d.production, preview: d.preview, close: true });
          return;
        }
        upRes.on('end', () => {
          responseDone = true;
        });
        upRes.on('error', () => {
          if (!responseDone) res.destroy();
        });
        upRes.pipe(res);
      });

      upReq.on('error', (err) => {
        if (clientGone) return;
        if (res.headersSent) {
          // the backend failed while the answer was on its way: cut the client too, so it does not take a
          // truncated body for a whole one (an error after the full body, e.g. EPIPE on the request, is harmless)
          if (!responseDone) {
            info.err = errCode(err);
            res.destroy();
          }
          return;
        }
        if (isConnectError(err)) up.invalidate();
        const retry = attempts === 1 && !piping && (!connected || (upReq.reusedSocket && isConnectError(err)));
        if (retry) {
          attempt();
          return;
        }
        if (piping) req.unpipe(upReq);
        info.err = errCode(err);
        const status = err.code === 'BZ_UPSTREAM_TIMEOUT' ? 504 : 502;
        sendPage(res, status, req, { production: d.production, preview: d.preview, close: body, retryAfter: status === 502 ? 10 : undefined });
      });
    };
    attempt();
  }

  function onRequest(req, res) {
    const t0 = performance.now();
    active += 1;
    const info = { id: randomBytes(8).toString('hex'), host: '', method: req.method, path: '', status: 0, upstream: 'proxy' };
    res.on('close', () => {
      active -= 1;
      info.status = res.headersSent ? res.statusCode : 499;
      if (!res.writableFinished) info.aborted = true;
      finishLog(info, t0);
    });
    req.on('error', () => {});
    res.on('error', () => {});
    if (draining) res.shouldKeepAlive = false;

    const target = splitTarget(req.url);
    if (!target) {
      info.path = '-';
      sendPage(res, 400, req, { close: true });
      return;
    }
    info.path = target.path;
    const client = clientInfo({ peer: req.socket.remoteAddress, headers: req.headers, trust: config.trust });
    const d = decide({
      host: req.headers.host,
      method: req.method,
      path: target.path,
      query: target.query,
      previewCookie: readCookie(req.headers.cookie, PREVIEW_COOKIE),
      previewRouting: config.previewRouting,
      tasksOrigin: config.tasksOrigin,
    });
    info.host = d.host;

    switch (d.action) {
      case 'proxy':
        info.upstream = d.upstream;
        forward(req, res, d, client, info);
        return;
      case 'redirect':
        info.upstream = 'redirect';
        sendRedirect(res, req, d);
        return;
      case 'health':
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          sendPage(res, 405, req);
          return;
        }
        sendJson(res, draining ? 503 : 200, req, { ok: !draining, service: 'bizomat-proxy', version: config.version });
        return;
      case 'ready':
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          sendPage(res, 405, req);
          return;
        }
        readiness().then(
          (r) => sendJson(res, r.ok ? 200 : 503, req, r),
          () => sendJson(res, 503, req, { ok: false }),
        );
        return;
      case 'preview': {
        const location = previewNext(target.query);
        const bodyText = Buffer.from(d.target === 'clear' ? 'Preview cleared.\n' : `Preview: this browser now goes to ${d.target}.\n`);
        res.writeHead(303, {
          Location: location,
          'Set-Cookie': previewCookieHeader(d.target, client.proto === 'https'),
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Length': String(bodyText.length),
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex',
        });
        res.end(req.method === 'HEAD' ? undefined : bodyText);
        return;
      }
      default:
        sendPage(res, d.status || 404, req, { production: d.production });
    }
  }

  // ------------------------------------------------------------------ upgrades (WebSockets)

  function tunnel(a, b) {
    upgraded.add(a);
    upgraded.add(b);
    let ended = false;
    const end = () => {
      if (ended) return;
      ended = true;
      a.destroy();
      b.destroy();
      upgraded.delete(a);
      upgraded.delete(b);
    };
    for (const s of [a, b]) {
      s.setTimeout(config.idleTimeoutMs);
      s.setNoDelay(true);
      s.setKeepAlive(true, 30_000);
      s.on('timeout', end);
      s.on('error', end);
      s.on('close', end);
    }
    a.pipe(b);
    b.pipe(a);
  }

  function onUpgrade(req, socket, head) {
    const t0 = performance.now();
    const info = { id: randomBytes(8).toString('hex'), host: '', method: req.method, path: '-', status: 0, upstream: 'proxy', upgrade: true };
    let logged = false;
    const done = (status) => {
      if (logged) return;
      logged = true;
      info.status = status;
      finishLog(info, t0);
    };
    socket.on('error', () => socket.destroy());
    const refuse = (status, headers = {}, production = false) => {
      const page = errorPage(status, { html: wantsHtml(req.headers.accept) });
      const h = { ...page.headers, ...headers };
      delete h['Content-Length'];
      if (production) h['Strict-Transport-Security'] = HSTS_VALUE;
      if (status === 405) h.Allow = 'GET, HEAD';
      socket.end(rawResponse(status, STATUS_TEXT[status] || 'Error', h, page.body));
      done(status);
    };

    const target = splitTarget(req.url);
    if (!target) return refuse(400);
    info.path = target.path;
    const client = clientInfo({ peer: socket.remoteAddress, headers: req.headers, trust: config.trust });
    const d = decide({
      host: req.headers.host,
      method: req.method,
      path: target.path,
      query: target.query,
      previewCookie: readCookie(req.headers.cookie, PREVIEW_COOKIE),
      previewRouting: config.previewRouting,
      tasksOrigin: config.tasksOrigin,
    });
    info.host = d.host;
    if (d.action === 'redirect') {
      const h = { Location: d.location, 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': d.temporary ? 'no-store' : 'public, max-age=86400' };
      if (d.production) h['Strict-Transport-Security'] = HSTS_VALUE;
      socket.end(rawResponse(d.status, STATUS_TEXT[d.status], h));
      info.upstream = 'redirect';
      done(d.status);
      return;
    }
    if (d.action !== 'proxy') return refuse(d.status && d.action === 'error' ? d.status : 400, {}, d.production);
    const upgradeValue = String(req.headers.upgrade || '');
    if (!upgradeValue || /\bh2c\b/i.test(upgradeValue)) return refuse(400, {}, d.production);
    if (draining) return refuse(503, {}, d.production);

    const up = upstreams[d.upstream];
    info.upstream = d.upstream;
    const headers = upstreamRequestHeaders(req.rawHeaders, {
      client, host: req.headers.host, requestId: info.id, upgrade: upgradeValue, dropCookie: d.preview ? PREVIEW_COOKIE : '',
    });

    let settled = false;
    let attempts = 0;
    let current = null;
    socket.on('close', () => {
      if (!settled && current) current.destroy();
    });

    const attempt = () => {
      attempts += 1;
      let connected = false;
      const upReq = http.request(up.requestOptions({ method: req.method, path: req.url, headers, setHost: false, agent: false }));
      current = upReq;
      upReq.setTimeout(HANDSHAKE_TIMEOUT_MS, () => {
        if (!settled) upReq.destroy(timeoutError());
      });
      upReq.on('socket', (s) => {
        if (s.connecting) s.once('connect', () => { connected = true; });
        else connected = true;
      });
      upReq.on('upgrade', (upRes, upSocket, upHead) => {
        settled = true;
        upReq.setTimeout(0);
        if (socket.destroyed) {
          upSocket.destroy();
          return;
        }
        const out = clientResponseHeaders(upRes.rawHeaders, { production: false, preview: d.preview, keepUpgrade: true });
        const lines = [`HTTP/1.1 ${upRes.statusCode} ${upRes.statusMessage || 'Switching Protocols'}`];
        for (let i = 0; i < out.length; i += 2) lines.push(`${out[i]}: ${out[i + 1]}`);
        socket.write(`${lines.join('\r\n')}\r\n\r\n`);
        if (upHead && upHead.length) socket.write(upHead);
        if (head && head.length) upSocket.write(head);
        tunnel(socket, upSocket);
        done(upRes.statusCode);
      });
      upReq.on('response', (upRes) => {
        // the backend refused the upgrade (401, 403, 426...): pass its answer on, then close
        settled = true;
        const out = clientResponseHeaders(upRes.rawHeaders, { production: d.production, preview: d.preview, app: isApp(d) });
        const lines = [`HTTP/1.1 ${upRes.statusCode} ${upRes.statusMessage || ''}`.trimEnd()];
        for (let i = 0; i < out.length; i += 2) {
          if (out[i].toLowerCase() === 'connection') continue;
          lines.push(`${out[i]}: ${out[i + 1]}`);
        }
        lines.push('Connection: close');
        socket.write(`${lines.join('\r\n')}\r\n\r\n`);
        upRes.on('error', () => socket.destroy());
        upRes.pipe(socket);
        done(upRes.statusCode);
      });
      upReq.on('error', (err) => {
        if (settled || socket.destroyed) return;
        if (isConnectError(err)) up.invalidate();
        if (attempts === 1 && !connected && isConnectError(err)) {
          attempt();
          return;
        }
        info.err = errCode(err);
        refuse(err.code === 'BZ_UPSTREAM_TIMEOUT' ? 504 : 502, {}, d.production);
      });
      upReq.end();
    };
    attempt();
  }

  server.on('request', onRequest);
  server.on('upgrade', onUpgrade);
  server.on('connection', (socket) => {
    socket.on('error', () => {});
  });

  function close() {
    if (closing) return closing;
    draining = true;
    closing = new Promise((resolve) => {
      const deadline = setTimeout(() => {
        server.closeAllConnections();
        for (const s of upgraded) s.destroy();
      }, config.shutdownGraceMs);
      deadline.unref();
      server.close(() => {
        clearTimeout(deadline);
        for (const up of Object.values(upstreams)) up.close();
        resolve();
      });
      server.closeIdleConnections();
      if (config.shutdownGraceMs === 0) {
        server.closeAllConnections();
        for (const s of upgraded) s.destroy();
      }
    });
    return closing;
  }

  return {
    server,
    upstreams,
    close,
    stats: () => ({ active, upgraded: upgraded.size, draining }),
  };
}

/** Listen on host:port; when the host is '::' and IPv6 is not available here, listen on 0.0.0.0 instead. */
export function listen(server, port, host) {
  return new Promise((resolve, reject) => {
    const tryListen = (h, fallback) => {
      const onError = (err) => {
        server.removeListener('listening', onListening);
        if (fallback && ['EAFNOSUPPORT', 'EADDRNOTAVAIL', 'EINVAL'].includes(err.code)) tryListen('0.0.0.0', false);
        else reject(err);
      };
      const onListening = () => {
        server.removeListener('error', onError);
        resolve(server.address());
      };
      server.once('error', onError);
      server.once('listening', onListening);
      server.listen({ port, host: h });
    };
    tryListen(host, host === '::');
  });
}
