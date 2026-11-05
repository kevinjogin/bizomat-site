// Static assets for the website on Node: the same behaviour the site has on Cloudflare Workers Static Assets, so the
// built dist/ folder works unchanged on either host.
//   - dist/_redirects (Cloudflare format): exact rules, then rules with * (splat) or :placeholders, first match wins.
//   - dist/_headers (Cloudflare format): every block whose path pattern matches adds its headers.
//   - html_handling "auto-trailing-slash": /about/ serves about/index.html; /about redirects to /about/.
//   - not_found_handling "404-page": unknown paths get dist/404.html with status 404.
// Files are read only from inside the dist folder (no traversal), and the configuration files are never served.
import { createReadStream, existsSync, readFileSync, statSync, type Stats } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { Readable } from 'node:stream';
import { brotliCompressSync, gzipSync, constants as zlib } from 'node:zlib';

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.ttf': 'font/ttf', '.pdf': 'application/pdf', '.webmanifest': 'application/manifest+json', '.wasm': 'application/wasm',
  '.pf_meta': 'application/octet-stream', '.pf_index': 'application/octet-stream', '.pf_fragment': 'application/octet-stream', '.pagefind': 'application/octet-stream',
};
const COMPRESSIBLE = /^(text\/|application\/(json|javascript|xml|manifest\+json)|image\/svg\+xml)/;
const HIDDEN = new Set(['/_headers', '/_redirects', '/_routes.json', '/_worker.js']);

interface RedirectRule { from: string; to: string; status: number; re?: RegExp; names?: string[] }
interface HeaderRule { re: RegExp; headers: [string, string][] }

/** Parse a Cloudflare _redirects file. Lines: "from to [status]"; # starts a comment. */
export function parseRedirects(text: string): { exact: Map<string, RedirectRule>; dynamic: RedirectRule[] } {
  const exact = new Map<string, RedirectRule>();
  const dynamic: RedirectRule[] = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const [from, to, code] = line.split(/\s+/);
    if (!from || !to || !from.startsWith('/')) continue;
    const status = Number(code) || 302;
    if (!from.includes('*') && !from.includes(':')) {
      if (!exact.has(from)) exact.set(from, { from, to, status });
      continue;
    }
    const names: string[] = [];
    const pattern = from.split('/').map((seg) => {
      if (seg === '*') { names.push('splat'); return '(.*)'; }
      if (seg.startsWith(':')) { names.push(seg.slice(1)); return '([^/]+)'; }
      return seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '(.*)');
    }).join('/');
    dynamic.push({ from, to, status, names, re: new RegExp(`^${pattern}$`) });
  }
  return { exact, dynamic };
}

/** Parse a Cloudflare _headers file. A path line starts a block; indented "Name: value" lines belong to it. */
export function parseHeaders(text: string): HeaderRule[] {
  const rules: HeaderRule[] = [];
  let current: HeaderRule | null = null;
  for (const raw of text.split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    if (!/^\s/.test(raw)) {
      const path = raw.trim();
      // Absolute-URL rules (for example the pages.dev address) do not apply to this host.
      if (!path.startsWith('/')) { current = null; continue; }
      const re = new RegExp(`^${path.split('*').map((p) => p.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/:[A-Za-z]\w*/g, '[^/]+')).join('.*')}$`);
      current = { re, headers: [] };
      rules.push(current);
    } else if (current) {
      const i = raw.indexOf(':');
      if (i > 0) current.headers.push([raw.slice(0, i).trim(), raw.slice(i + 1).trim()]);
    }
  }
  return rules;
}

export interface AssetsOptions { dir: string; cacheBytes?: number }

/** The ASSETS binding: fetch(request) -> Response, as env.ASSETS behaves on Cloudflare. */
export function createAssets({ dir, cacheBytes = 64 * 2 ** 20 }: AssetsOptions) {
  const root = resolve(dir);
  const read = (name: string) => (existsSync(join(root, name)) ? readFileSync(join(root, name), 'utf8') : '');
  const redirects = parseRedirects(read('_redirects'));
  const headerRules = parseHeaders(read('_headers'));
  const notFound = existsSync(join(root, '404.html')) ? join(root, '404.html') : null;
  const cache = new Map<string, Buffer>();
  let cached = 0;

  const remember = (key: string, buf: Buffer) => {
    if (buf.length > cacheBytes / 8) return;
    cache.set(key, buf);
    cached += buf.length;
    for (const [k, v] of cache) { if (cached <= cacheBytes) break; cache.delete(k); cached -= v.length; }
  };

  /** A path inside the dist folder, or null for anything that would leave it. */
  const inside = (pathname: string): string | null => {
    let decoded: string;
    try { decoded = decodeURIComponent(pathname); } catch { return null; }
    if (decoded.includes('\0')) return null;
    const full = normalize(join(root, decoded));
    return full === root || full.startsWith(root + sep) ? full : null;
  };
  const fileAt = (full: string | null): { path: string; stat: Stats } | null => {
    if (!full) return null;
    try { const stat = statSync(full); return stat.isFile() ? { path: full, stat } : null; } catch { return null; }
  };

  function redirectFor(pathname: string, search: string): Response | null {
    const rule = redirects.exact.get(pathname);
    let to: string | null = rule ? rule.to : null;
    let status = rule?.status ?? 0;
    if (!rule) {
      for (const r of redirects.dynamic) {
        const m = r.re!.exec(pathname);
        if (!m) continue;
        to = r.to;
        r.names!.forEach((n, i) => { to = to!.replace(n === 'splat' ? ':splat' : `:${n}`, m[i + 1] ?? ''); });
        status = r.status;
        break;
      }
    }
    if (!to) return null;
    const location = /^https?:/.test(to) || to.includes('?') ? to : `${to}${search}`;
    return new Response(null, { status, headers: { Location: location, 'Cache-Control': 'public, max-age=3600' } });
  }

  function headersFor(pathname: string, type: string, size: number, mtime: number): Headers {
    const h = new Headers({ 'Content-Type': type });
    for (const rule of headerRules) if (rule.re.test(pathname)) for (const [k, v] of rule.headers) h.set(k, v);
    if (!h.has('Cache-Control')) h.set('Cache-Control', type.startsWith('text/html') ? 'public, max-age=0, must-revalidate' : 'public, max-age=86400');
    h.set('ETag', `W/"${size.toString(36)}-${Math.floor(mtime).toString(36)}"`);
    return h;
  }

  function serve(request: Request, url: URL, file: { path: string; stat: Stats }, status = 200, logicalPath = url.pathname): Response {
    const type = TYPES[extname(file.path).toLowerCase()] ?? 'application/octet-stream';
    const headers = headersFor(logicalPath, type, file.stat.size, file.stat.mtimeMs);
    if (status === 200 && request.headers.get('If-None-Match') === headers.get('ETag')) return new Response(null, { status: 304, headers });
    const head = request.method === 'HEAD';
    const accept = request.headers.get('Accept-Encoding') ?? '';
    const encoding = /\bbr\b/.test(accept) ? 'br' : /\bgzip\b/.test(accept) ? 'gzip' : '';
    if (COMPRESSIBLE.test(type) && encoding && file.stat.size > 1024 && file.stat.size < 8 * 2 ** 20) {
      const key = `${file.path}|${file.stat.mtimeMs}|${encoding}`;
      let body = cache.get(key);
      if (!body) {
        const raw = readFileSync(file.path);
        body = encoding === 'br' ? brotliCompressSync(raw, { params: { [zlib.BROTLI_PARAM_QUALITY]: 5 } }) : gzipSync(raw, { level: 6 });
        remember(key, body);
      }
      headers.set('Content-Encoding', encoding);
      headers.set('Vary', 'Accept-Encoding');
      headers.set('Content-Length', String(body.length));
      return new Response(head ? null : body, { status, headers });
    }
    headers.set('Accept-Ranges', 'bytes');
    const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get('Range') ?? '');
    if (range && status === 200 && (range[1] || range[2])) {
      const size = file.stat.size;
      const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
      const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
      if (start > end || start >= size) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
      headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
      headers.set('Content-Length', String(end - start + 1));
      return new Response(head ? null : (Readable.toWeb(createReadStream(file.path, { start, end })) as ReadableStream), { status: 206, headers });
    }
    headers.set('Content-Length', String(file.stat.size));
    return new Response(head ? null : (Readable.toWeb(createReadStream(file.path)) as ReadableStream), { status, headers });
  }

  return {
    async fetch(input: Request | string | URL): Promise<Response> {
      const request = input instanceof Request ? input : new Request(input);
      const url = new URL(request.url);
      if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
      const redirect = redirectFor(url.pathname, url.search);
      if (redirect) return redirect;
      if (!HIDDEN.has(url.pathname)) {
        const direct = url.pathname.endsWith('/') ? fileAt(inside(`${url.pathname}index.html`)) : fileAt(inside(url.pathname));
        if (direct) return serve(request, url, direct);
        if (!url.pathname.endsWith('/')) {
          if (fileAt(inside(`${url.pathname}/index.html`))) {
            return new Response(null, { status: 307, headers: { Location: `${url.pathname}/${url.search}`, 'Cache-Control': 'public, max-age=3600' } });
          }
          const html = fileAt(inside(`${url.pathname}.html`));
          if (html) return serve(request, url, html);
        }
      }
      const missing = notFound ? fileAt(notFound) : null;
      if (missing) return serve(request, url, missing, 404, '/404.html');
      return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    },
  };
}
