// BIZOMAT edge proxy: one backend (web, work or cad) reached over plain HTTP.
//
// On Fly the backends are other Machines of the same app, reached over the private network (6PN) by the name
// `<process group>.process.<app>.internal`. That name only has AAAA records (6PN is IPv6 only) holding the
// addresses of the group's started Machines, and the addresses change when a Machine is replaced. So:
//   - names ending in .internal are looked up as IPv6 only (family 6); other names use the system order;
//   - the answer is cached for a few seconds (PROXY_DNS_TTL_MS) and dropped as soon as a connection to it fails,
//     so the next attempt (and the proxy's single retry) looks the name up again;
//   - several addresses are used in turn (round robin), and Node tries the next one when one does not answer;
//   - IPv6 literals in the URL are written with brackets (http://[fdaa::3]:8001) and connected without them.

import dns from 'node:dns';
import http from 'node:http';
import net from 'node:net';

const CONNECT_ERRORS = new Set([
  'ECONNREFUSED', 'EHOSTUNREACH', 'ENETUNREACH', 'EHOSTDOWN', 'ETIMEDOUT', 'EAI_AGAIN', 'ENOTFOUND', 'EADDRNOTAVAIL',
  'ECONNRESET', 'EPIPE', 'ENODATA', 'ESERVFAIL', 'ECONNABORTED',
]);

export function isConnectError(err) {
  return Boolean(err && (CONNECT_ERRORS.has(err.code) || err.code === 'ERR_SOCKET_CONNECTION_TIMEOUT' || err.name === 'AggregateError'));
}

export class Upstream {
  /**
   * @param {string} name     web | work | cad
   * @param {string} baseUrl  http://host:port (no path, query or credentials)
   * @param {object} [opts]
   * @param {Function} [opts.resolve] (hostname, {family, all}) => Promise<[{address, family}]>  (dns.promises.lookup)
   * @param {number} [opts.ttlMs]     how long a lookup answer is used
   */
  constructor(name, baseUrl, { resolve = dns.promises.lookup, ttlMs = 5000 } = {}) {
    let url;
    try {
      url = new URL(baseUrl);
    } catch {
      throw new Error(`UPSTREAM_${name.toUpperCase()} is not a URL: ${baseUrl}`);
    }
    if (url.protocol !== 'http:') throw new Error(`UPSTREAM_${name.toUpperCase()} must be http:// (the private network is not TLS)`);
    if ((url.pathname && url.pathname !== '/') || url.search || url.hash || url.username || url.password) {
      throw new Error(`UPSTREAM_${name.toUpperCase()} must be scheme, host and port only: ${baseUrl}`);
    }
    this.name = name;
    this.hostname = url.hostname.startsWith('[') ? url.hostname.slice(1, -1) : url.hostname;
    this.port = Number(url.port || 80);
    this.literal = net.isIP(this.hostname); // 0 for a name, 4 or 6 for an address
    this.family = this.literal || (this.hostname.endsWith('.internal') ? 6 : 0);
    this.display = url.host; // the bracketed form, for messages
    this.resolveFn = resolve;
    this.ttlMs = ttlMs;
    this.cache = null;
    this.pending = null;
    this.turn = 0;
    this.lookups = 0;
    // Keep-alive to the backend. Idle sockets are closed after 4 s, before the backends' own 5 s keep-alive
    // timeout (Node and uvicorn), so the proxy does not reuse a socket the backend is closing.
    this.agent = new http.Agent({ keepAlive: true, keepAliveMsecs: 15_000, maxFreeSockets: 64, timeout: 4_000, scheduling: 'lifo' });
    this.lookup = this.lookup.bind(this);
  }

  /** The backend's addresses, from the cache or a fresh lookup. */
  async addresses() {
    if (this.literal) return [{ address: this.hostname, family: this.literal }];
    const now = Date.now();
    if (this.cache && this.cache.expires > now) return this.cache.addrs;
    if (!this.pending) {
      this.lookups += 1;
      this.pending = Promise.resolve(this.resolveFn(this.hostname, { all: true, family: this.family, verbatim: true }))
        .then((addrs) => {
          const list = (Array.isArray(addrs) ? addrs : [addrs]).filter((a) => a && a.address);
          if (!list.length) throw Object.assign(new Error(`no addresses for ${this.hostname}`), { code: 'ENOTFOUND' });
          this.cache = { addrs: list, expires: Date.now() + this.ttlMs };
          return list;
        })
        .finally(() => {
          this.pending = null;
        });
    }
    return this.pending;
  }

  /** Forget the cached answer (a connection to it failed). */
  invalidate() {
    this.cache = null;
  }

  /** net.connect `lookup` hook: answers from addresses(), rotating the order on every connection. */
  lookup(hostname, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    this.addresses().then(
      (addrs) => {
        const start = this.turn++ % addrs.length;
        const ordered = addrs.slice(start).concat(addrs.slice(0, start));
        if (options && options.all) callback(null, ordered.map((a) => ({ address: a.address, family: a.family })));
        else callback(null, ordered[0].address, ordered[0].family);
      },
      (err) => callback(err),
    );
  }

  /** Options for http.request to this backend. */
  requestOptions(extra = {}) {
    const base = { host: this.hostname, port: this.port, agent: this.agent };
    if (!this.literal) base.lookup = this.lookup;
    else base.family = this.literal;
    return { ...base, ...extra };
  }

  /** GET <path> with a short timeout: {ok, status, ms} (never throws, never says where the backend is). */
  probe(path, timeoutMs = 2500) {
    const started = performance.now();
    return new Promise((resolve) => {
      let done = false;
      const finish = (ok, status, error) => {
        if (done) return;
        done = true;
        if (error && isConnectError({ code: error })) this.invalidate();
        resolve({ ok, status, ms: Math.round(performance.now() - started), ...(error ? { error } : {}) });
      };
      const req = http.request(this.requestOptions({
        method: 'GET',
        path,
        agent: false,
        headers: { Host: this.display, 'User-Agent': 'bizomat-proxy-ready', Accept: 'application/json' },
      }));
      req.setTimeout(timeoutMs, () => {
        req.destroy(Object.assign(new Error('probe timeout'), { code: 'ETIMEDOUT' }));
      });
      req.on('response', (res) => {
        res.resume();
        res.on('end', () => finish(res.statusCode >= 200 && res.statusCode < 300, res.statusCode));
        res.on('error', () => finish(false, res.statusCode, 'ECONNRESET'));
      });
      req.on('error', (err) => finish(false, 0, err.code || 'ERROR'));
      req.end();
    });
  }

  close() {
    this.agent.destroy();
  }
}
