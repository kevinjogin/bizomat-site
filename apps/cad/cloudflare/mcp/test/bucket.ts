// A stand-in for the R2 bucket: in memory, paged listings like R2, and the put checksum check R2 does.
import type { StoreBucket } from '../src/persist';

export type Stored = { bytes: Uint8Array; customMetadata?: Record<string, string> };

export async function sha(data: Uint8Array | string): Promise<string> {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return [...digest].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function bytesOf(value: ReadableStream | ArrayBuffer | Uint8Array): Promise<Uint8Array> {
  if (value instanceof Uint8Array) return value.slice();
  if (value instanceof ArrayBuffer) return new Uint8Array(value.slice(0));
  return new Uint8Array(await new Response(value).arrayBuffer());
}

export function bucket(pageSize = 1000) {
  const items = new Map<string, Stored>();
  const b: StoreBucket & { items: Map<string, Stored>; lists: number; failPuts: boolean } = {
    items,
    lists: 0,
    failPuts: false,
    async list({ prefix, cursor }) {
      b.lists++;
      const keys = [...items.keys()].filter((k) => k.startsWith(prefix)).sort();
      const start = cursor ? Number(cursor) : 0;
      const page = keys.slice(start, start + pageSize);
      const truncated = start + pageSize < keys.length;
      return {
        objects: page.map((key) => ({ key, size: items.get(key)!.bytes.byteLength, customMetadata: items.get(key)!.customMetadata })),
        truncated,
        cursor: truncated ? String(start + pageSize) : undefined,
      };
    },
    async get(key) {
      const o = items.get(key);
      if (!o) return null;
      return { body: new Response(o.bytes.slice()).body!, size: o.bytes.byteLength };
    },
    async put(key, value, options) {
      const bytes = await bytesOf(value);
      if (b.failPuts) throw new Error('put: We encountered an internal error. Please try again. (10001)');
      if ((await sha(bytes)) !== options.sha256) throw new Error('put: The SHA-256 checksum you specified did not match what we received.');
      items.set(key, { bytes, customMetadata: options.customMetadata });
      return {};
    },
    async delete(key) {
      items.delete(key);
    },
  };
  return b;
}
