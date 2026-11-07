// Public downloads on bizomat.ai: https://bizomat.ai/downloads/<folder>/<file>, served from the R2 bucket
// bizomat-downloads (wrangler.toml [[r2_buckets]] DOWNLOADS). The GitHub repositories, and so their releases, are
// private, so the SOLIDWORKS installer, its checksum and the update manifest are published here instead
// (CADOS tools/laptop/cloudflare.ps1 publish installer).
//
// Only files of the listed kinds, in one folder below /downloads/, are served. A versioned name (one with a version
// number, e.g. BIZOMAT-CAD-Automation-0.13.0-x64.msi) never changes, so it may be cached for a year; a stable name
// (BIZOMAT-CAD-Automation-x64.msi) points at the latest and is cached for five minutes.

/** The part of an R2 bucket the downloads use (R2Bucket fits; tests pass a stand-in). */
export interface DownloadsBucket {
  get(key: string): Promise<{ body: ReadableStream; size: number; httpEtag?: string } | null>;
}

export const DOWNLOADS_PATH = '/downloads/';

const KEY = /^[a-z0-9-]{1,40}\/[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
const TYPES: Record<string, { type: string; attachment: boolean }> = {
  msi: { type: 'application/x-msi', attachment: true },
  zip: { type: 'application/zip', attachment: true },
  sha256: { type: 'text/plain; charset=utf-8', attachment: false },
  txt: { type: 'text/plain; charset=utf-8', attachment: false },
  json: { type: 'application/json', attachment: false },
};
const VERSIONED = /-\d+\.\d+\.\d+(?:[-.][0-9A-Za-z.]+)?(?:-x64)?\.[a-z0-9]+(?:\.sha256)?$/;

const text = (status: number, message: string, extra: Record<string, string> = {}) =>
  new Response(message, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', ...extra } });

/** Answers GET and HEAD for /downloads/<folder>/<file>. */
export async function handleDownload(request: Request, bucket: DownloadsBucket | undefined): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') return text(405, 'Method not allowed', { Allow: 'GET, HEAD' });
  if (!bucket) return text(404, 'Not found');
  let key: string;
  try {
    key = decodeURIComponent(new URL(request.url).pathname.slice(DOWNLOADS_PATH.length));
  } catch {
    return text(404, 'Not found');
  }
  if (!KEY.test(key) || key.includes('..')) return text(404, 'Not found');
  const kind = TYPES[key.slice(key.lastIndexOf('.') + 1).toLowerCase()];
  if (!kind) return text(404, 'Not found');
  const object = await bucket.get(key);
  if (!object) return text(404, 'Not found');
  const name = key.slice(key.indexOf('/') + 1);
  const headers: Record<string, string> = {
    'Content-Type': kind.type,
    'Content-Length': String(object.size),
    'Cache-Control': VERSIONED.test(name) ? 'public, max-age=31536000, immutable' : 'public, max-age=300',
    'X-Content-Type-Options': 'nosniff',
  };
  if (object.httpEtag) headers.ETag = object.httpEtag;
  if (kind.attachment) headers['Content-Disposition'] = `attachment; filename="${name}"`;
  return new Response(request.method === 'HEAD' ? null : object.body, { status: 200, headers });
}
