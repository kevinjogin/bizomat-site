// The data store of CAD Automation's server on Cloudflare, kept in the Worker's R2 bucket.
//
// Cloudflare Containers start from a fresh disk after every sleep, restart or deploy, so the server's supervisor
// (opensketch/persist.py) restores its data folder from here before the server starts and copies changed state files
// back while it runs. The container reaches this handler as http://persist.bizomat.internal, an outbound handler that
// runs in the Workers runtime on the same machine: nothing outside the container can call it, and the container never
// holds R2 credentials.
//
//   GET    /list      -> {"objects": [{"key": "data/users.json", "size": 123, "sha256": "..."}, ...]}
//   GET    /o/<key>   -> the bytes (404 when absent)
//   PUT    /o/<key>   -> stores them; Content-Length and X-Content-SHA256 are required, and R2 itself refuses a body
//                        that does not match the checksum (400), so a torn upload never replaces a good copy
//   DELETE /o/<key>
//
// Bodies stream between the container and R2: a state file is never held whole in the Worker's memory.
// Keys are "data/<file name>": one flat folder, names of letters, digits, dot, dash and underscore (persist.py NAME).

export const PERSIST_HOST = 'persist.bizomat.internal';
export const MAX_OBJECT = 64 * 1024 * 1024; // the server never sends a larger state file (persist.py MAX_FILE)
const KEY = /^data\/[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
const SHA256 = /^[0-9a-f]{64}$/;

type Body = ReadableStream | ArrayBuffer | Uint8Array;

/** The part of an R2 bucket the store uses (R2Bucket fits; tests pass a stand-in). */
export interface StoreBucket {
  list(options: { prefix: string; cursor?: string; include?: ('customMetadata' | 'httpMetadata')[] }): Promise<{
    objects: { key: string; size: number; customMetadata?: Record<string, string> }[];
    truncated: boolean;
    cursor?: string;
  }>;
  get(key: string): Promise<{ body: ReadableStream; size: number } | null>;
  put(key: string, value: Body, options: { sha256: string; customMetadata: Record<string, string>; httpMetadata: { contentType: string } }): Promise<unknown>;
  delete(key: string): Promise<void>;
}

const text = (status: number, message: string) => new Response(message, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });

/** The body as a stream of exactly `size` bytes: R2 needs to know the length, and a short or long body fails the put. */
function exactly(body: ReadableStream, size: number): ReadableStream {
  const Fixed = (globalThis as { FixedLengthStream?: new (length: number) => TransformStream }).FixedLengthStream;
  if (!Fixed) return body; // not in the Workers runtime (the tests): the stand-in bucket checks the bytes itself
  const { readable, writable } = new Fixed(size);
  body.pipeTo(writable).catch(() => {}); // a failed copy errors `readable`, so the put fails and nothing is stored
  return readable;
}

/** Answers the server's data store calls. */
export async function handlePersist(request: Request, bucket: StoreBucket): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname === '/list') {
    if (request.method !== 'GET') return text(405, 'method not allowed');
    const objects: { key: string; size: number; sha256: string | null }[] = [];
    let cursor: string | undefined;
    do {
      const page = await bucket.list({ prefix: 'data/', cursor, include: ['customMetadata'] });
      for (const o of page.objects) objects.push({ key: o.key, size: o.size, sha256: o.customMetadata?.sha256 ?? null });
      cursor = page.truncated ? page.cursor : undefined;
    } while (cursor);
    return Response.json({ objects });
  }
  if (!url.pathname.startsWith('/o/')) return text(404, 'not found');
  let key: string;
  try {
    key = decodeURIComponent(url.pathname.slice(3));
  } catch {
    return text(400, 'bad key');
  }
  if (!KEY.test(key) || key.includes('..')) return text(400, 'bad key');
  switch (request.method) {
    case 'GET': {
      const o = await bucket.get(key);
      if (!o) return text(404, 'not found');
      return new Response(o.body, { headers: { 'content-type': 'application/octet-stream', 'content-length': String(o.size) } });
    }
    case 'PUT': {
      const length = request.headers.get('content-length') ?? '';
      if (!/^\d{1,12}$/.test(length)) return text(411, 'length required');
      const size = Number(length);
      if (size > MAX_OBJECT) return text(413, 'too large');
      const sha256 = (request.headers.get('x-content-sha256') ?? '').toLowerCase();
      if (!SHA256.test(sha256)) return text(400, 'checksum required');
      const body = request.body && size > 0 ? exactly(request.body, size) : new Uint8Array(0);
      try {
        await bucket.put(key, body, { sha256, customMetadata: { sha256 }, httpMetadata: { contentType: 'application/octet-stream' } });
      } catch (e) {
        // R2 refused it: the body did not match its checksum or length, or R2 failed. The old copy stays.
        return text(400, `not stored: ${e instanceof Error ? e.message : String(e)}`.slice(0, 300));
      }
      return new Response(null, { status: 204 });
    }
    case 'DELETE':
      await bucket.delete(key);
      return new Response(null, { status: 204 });
    default:
      return text(405, 'method not allowed');
  }
}
