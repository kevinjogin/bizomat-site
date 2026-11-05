// Layout of WORK_DATA_DIR. Shared by the server and scripts/migrate/*.mjs
// (which import this file directly: erasable TypeScript only, `.ts` imports).
//
//   db.sqlite        the application database: exactly the D1 schema
//   runtime.sqlite   Node-only state: R2 object index, KV entries
//   files/           R2 object bodies, named by a hash of the key
//   files/.tmp/      partial uploads (never referenced by the index)

import { join, resolve } from 'node:path';

export interface DataLayout {
  root: string;
  db: string;
  runtime: string;
  files: string;
  tmp: string;
}

export function dataLayout(root: string): DataLayout {
  const r = resolve(root);
  const files = join(r, 'files');
  return { root: r, db: join(r, 'db.sqlite'), runtime: join(r, 'runtime.sqlite'), files, tmp: join(files, '.tmp') };
}

/** The bucket name the Worker's FILES binding uses inside runtime.sqlite. */
export const FILES_BUCKET = 'FILES';
/** The namespace name the Worker's CACHE binding uses inside runtime.sqlite. */
export const CACHE_NAMESPACE = 'CACHE';
