// Workers Static Assets for the Node runtime (env.ASSETS), configured as in
// wrangler.jsonc: not_found_handling "single-page-application" (unknown paths
// get index.html with 200) and the default html_handling
// "auto-trailing-slash" (/page.html redirects to /page, /page serves
// page.html, /dir/ serves dir/index.html).
//
// At startup the static directory is read into a manifest (path -> file,
// size, content hash, content type). Requests are answered from the manifest
// only: a request path is a lookup key and never becomes a filesystem path,
// so there is no traversal and no directory listing. Hidden files (except
// .well-known) and symbolic links are not served. Hashed files under /assets/
// are cacheable for a year (immutable); everything else must revalidate.
// Compressible files are compressed once in the background (brotli and gzip,
// as Cloudflare compresses at the edge) and served compressed to clients that
// accept it.

import { createHash } from 'node:crypto';
import { createReadStream, lstatSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { Readable } from 'node:stream';
import { promisify } from 'node:util';
import { brotliCompress, constants as zlib, gzip } from 'node:zlib';
import type { Logger } from './log.ts';

const brotli = promisify(brotliCompress);
const gz = promisify(gzip);

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.cjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.wasm': 'application/wasm',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
};
const COMPRESSIBLE = new Set(['.html', '.htm', '.js', '.mjs', '.cjs', '.css', '.json', '.map', '.webmanifest', '.txt', '.xml', '.svg', '.ico', '.ttf', '.otf']);
const MAX_FILES = 20_000;
const MIN_COMPRESS_BYTES = 1024;

interface Asset {
  path: string;
  file: string;
  size: number;
  etag: string;
  type: string;
  compressible: boolean;
  br?: Buffer;
  gzip?: Buffer;
}

function acceptedEncodings(header: string | null): Set<string> {
  const out = new Set<string>();
  for (const part of (header ?? '').split(',')) {
    const [token, ...params] = part.trim().toLowerCase().split(';');
    const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
    if (token && (!q || Number(q.slice(2)) > 0)) out.add(token);
  }
  return out;
}

export class StaticAssets {
  readonly #assets = new Map<string, Asset>();
  readonly #log: Logger;

  constructor(dir: string, log: Logger) {
    this.#log = log;
    this.#scan(dir, '');
    if (!this.#assets.has('/index.html')) log({ event: 'assets_warning', message: 'index.html not found in the static directory; the app pages will not load' });
  }

  get size(): number {
    return this.#assets.size;
  }

  #scan(dir: string, prefix: string, depth = 0): void {
    if (depth > 20) return;
    let names: string[];
    try {
      names = readdirSync(dir);
    } catch {
      if (depth === 0) this.#log({ event: 'assets_warning', message: 'static directory is missing or unreadable' });
      return;
    }
    for (const name of names.sort()) {
      if (name.startsWith('.') && !(depth === 0 && name === '.well-known')) continue;
      const file = join(dir, name);
      const st = lstatSync(file);
      if (st.isSymbolicLink()) continue;
      const urlPath = `${prefix}/${name}`;
      if (st.isDirectory()) this.#scan(file, urlPath, depth + 1);
      else if (st.isFile()) {
        if (this.#assets.size >= MAX_FILES) return;
        const ext = extname(name).toLowerCase();
        const hash = createHash('sha256').update(readFileSync(file)).digest('base64url').slice(0, 32);
        this.#assets.set(urlPath, { path: urlPath, file, size: st.size, etag: `"${hash}"`, type: TYPES[ext] ?? 'application/octet-stream', compressible: COMPRESSIBLE.has(ext) && st.size >= MIN_COMPRESS_BYTES });
      }
    }
  }

  /** Compresses compressible assets in the background (zlib's thread pool; the event loop is not blocked). */
  async precompress(): Promise<void> {
    for (const a of this.#assets.values()) {
      if (!a.compressible) continue;
      try {
        const raw = readFileSync(a.file);
        const [br, gzipped] = await Promise.all([
          brotli(raw, { params: { [zlib.BROTLI_PARAM_QUALITY]: 11, [zlib.BROTLI_PARAM_SIZE_HINT]: raw.length } }),
          gz(raw, { level: 9 }),
        ]);
        if (br.length < raw.length) a.br = br;
        if (gzipped.length < raw.length) a.gzip = gzipped;
      } catch (e) {
        this.#log({ event: 'assets_warning', message: `could not compress ${a.file.slice(-80)}: ${(e as Error).message}` });
      }
    }
  }

  /** The env.ASSETS binding. */
  readonly binding: Fetcher = {
    fetch: (input: RequestInfo | URL, init?: RequestInit) => this.fetch(new Request(input, init)),
    connect: () => {
      throw new Error('ASSETS.connect() is not supported');
    },
  } as unknown as Fetcher;

  async fetch(req: Request): Promise<Response> {
    if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    const url = new URL(req.url);
    let path: string | null;
    try {
      path = decodeURIComponent(url.pathname);
    } catch {
      path = null;
    }
    if (path !== null) {
      const exact = this.#assets.get(path);
      if (exact && path.endsWith('.html')) {
        const target = path.endsWith('/index.html') ? path.slice(0, -'index.html'.length) : path.slice(0, -'.html'.length);
        return this.#redirect(url, target || '/');
      }
      if (exact) return this.#serve(req, exact);
      if (path.endsWith('/')) {
        const index = this.#assets.get(`${path}index.html`);
        if (index) return this.#serve(req, index);
      } else {
        const html = this.#assets.get(`${path}.html`);
        if (html) return this.#serve(req, html);
        if (this.#assets.has(`${path}/index.html`)) return this.#redirect(url, `${path}/`);
      }
    }
    const index = this.#assets.get('/index.html');
    if (index) return this.#serve(req, index);
    return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  #redirect(url: URL, path: string): Response {
    const to = new URL(url.toString());
    to.pathname = path;
    return new Response(null, { status: 307, headers: { Location: to.pathname + to.search } });
  }

  #serve(req: Request, a: Asset): Response {
    const accept = acceptedEncodings(req.headers.get('Accept-Encoding'));
    const encoding = a.br && accept.has('br') ? 'br' : a.gzip && (accept.has('gzip') || accept.has('x-gzip')) ? 'gzip' : null;
    const etag = encoding ? `${a.etag.slice(0, -1)}-${encoding === 'br' ? 'br' : 'gz'}"` : a.etag;
    const headers = new Headers({
      'Content-Type': a.type,
      ETag: etag,
      'Cache-Control': a.path.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate',
    });
    if (a.compressible) headers.set('Vary', 'Accept-Encoding');
    const inm = req.headers.get('If-None-Match');
    if (inm && inm.split(',').some((t) => t.trim().replace(/^W\//, '') === etag)) return new Response(null, { status: 304, headers });
    const body = encoding === 'br' ? a.br! : encoding === 'gzip' ? a.gzip! : null;
    if (encoding) headers.set('Content-Encoding', encoding);
    headers.set('Content-Length', String(body ? body.length : a.size));
    if (req.method === 'HEAD') return new Response(null, { status: 200, headers });
    if (body) return new Response(new Uint8Array(body), { status: 200, headers });
    return new Response(Readable.toWeb(createReadStream(a.file)) as unknown as ReadableStream, { status: 200, headers });
  }
}
