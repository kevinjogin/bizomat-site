// Shared helpers for the D1/R2 migration scripts. They run on Node 22 and
// import the Node runtime's storage modules (src/node/store/*.ts) directly
// (Node 22.18+ strips TypeScript types natively), so the scripts and the
// server always agree on the database settings and the file layout.
//
// Nothing here prints row content: reports carry table names, counts,
// checksums and primary keys that look like ids (anything else is replaced by
// a short hash).

import { createHash } from 'node:crypto';
import { existsSync, openSync, closeSync, fsyncSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
export const MIGRATIONS_DIR = join(APP_ROOT, 'migrations');

/** --flag value / --switch parsing. Returns { positional, flags }. */
export function parseArgs(argv, { booleans = [], strings = [] } = {}) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) {
      positional.push(a);
      continue;
    }
    const [name, inline] = a.slice(2).split(/=(.*)/s);
    if (booleans.includes(name)) flags[name] = true;
    else if (strings.includes(name)) {
      const v = inline ?? argv[++i];
      if (v === undefined) throw new UsageError(`--${name} needs a value`);
      flags[name] = v;
    } else throw new UsageError(`Unknown option --${name}`);
  }
  return { positional, flags };
}

export class UsageError extends Error {}

export function sha256Hex(data) {
  return createHash('sha256').update(data).digest('hex');
}

/** A primary-key value as it may be reported: ids and numbers as they are, anything else as a short hash. */
export function safeValue(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number' || typeof v === 'bigint') return String(v);
  const s = typeof v === 'string' ? v : Buffer.isBuffer(v) || v instanceof Uint8Array ? Buffer.from(v).toString('hex') : String(v);
  if (/^[A-Za-z0-9_-]{1,24}$/.test(s)) return s;
  return `#${sha256Hex(s).slice(0, 12)}`;
}

export function quoteIdent(name) {
  return `"${String(name).replace(/"/g, '""')}"`;
}

export function userTables(db) {
  return db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND substr(name, 1, 7) <> 'sqlite_' AND substr(name, 1, 4) <> '_cf_' ORDER BY name")
    .all()
    .map((r) => r.name);
}

export function tableInfo(db, table) {
  const cols = db.prepare(`PRAGMA table_info(${quoteIdent(table)})`).all();
  const pk = cols
    .filter((c) => Number(c.pk) > 0)
    .sort((a, b) => Number(a.pk) - Number(b.pk))
    .map((c) => c.name);
  const withoutRowid = /\bWITHOUT\s+ROWID\b/i.test(db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?").get(table)?.sql ?? '');
  return { columns: cols.map((c) => c.name), pk, withoutRowid };
}

/** The reportable primary key of the row with the given rowid. */
export function rowKey(db, table, rowid) {
  const { pk } = tableInfo(db, table);
  if (pk.length === 0 || rowid === null || rowid === undefined) return `rowid ${rowid}`;
  const row = db.prepare(`SELECT ${pk.map(quoteIdent).join(', ')} FROM ${quoteIdent(table)} WHERE rowid = ?`).get(rowid);
  return row ? pk.map((c) => safeValue(row[c])).join(',') : `rowid ${rowid}`;
}

/**
 * Rows of a table with every value exactly as stored. node:sqlite (Node 22)
 * returns TEXT only up to the first NUL character, so text is read as bytes
 * (CAST AS BLOB) together with its type and decoded here.
 */
export function* exactRows(db, table, orderBy) {
  const { columns } = table === 'sqlite_sequence' ? { columns: ['name', 'seq'] } : tableInfo(db, table);
  const select = columns.map((c) => `typeof(${quoteIdent(c)}), CASE WHEN typeof(${quoteIdent(c)}) = 'text' THEN CAST(${quoteIdent(c)} AS BLOB) ELSE ${quoteIdent(c)} END`).join(', ');
  const stmt = db.prepare(`SELECT ${select} FROM ${quoteIdent(table)}${orderBy ? ` ORDER BY ${orderBy}` : ''}`);
  stmt.setReadBigInts(true);
  stmt.setReturnArrays(true);
  for (const raw of stmt.iterate()) {
    const row = [];
    for (let i = 0; i < raw.length; i += 2) {
      const type = raw[i];
      const v = raw[i + 1];
      row.push(type === 'text' ? Buffer.from(v ?? new Uint8Array(0)).toString('utf8') : type === 'blob' ? new Uint8Array(v ?? new Uint8Array(0)) : v);
    }
    yield row;
  }
}

export function orderClause(db, table) {
  if (table === 'sqlite_sequence') return quoteIdent('name');
  const { pk, withoutRowid } = tableInfo(db, table);
  return pk.length ? pk.map(quoteIdent).join(', ') : withoutRowid ? '' : 'rowid';
}

function canonical(v) {
  if (v === null || v === undefined) return 'n';
  if (typeof v === 'bigint') return `i${v}`;
  if (typeof v === 'number') return `r${Object.is(v, -0) ? '-0' : String(v)}`;
  if (typeof v === 'string') return `s${Buffer.byteLength(v)}:${v}`;
  if (v instanceof Uint8Array) return `b${Buffer.from(v).toString('hex')}`;
  return `?${String(v)}`;
}

/**
 * Row count and SHA-256 of every user table (and sqlite_sequence), over the
 * rows in primary-key order with typed, exact values. Equal checksums mean
 * equal data, independent of the physical order of the rows.
 */
export function tableChecksums(db) {
  const out = {};
  const tables = userTables(db);
  if (db.prepare("SELECT 1 FROM sqlite_master WHERE name = 'sqlite_sequence'").get()) tables.push('sqlite_sequence');
  for (const t of tables) {
    const h = createHash('sha256');
    let rows = 0;
    for (const row of exactRows(db, t, orderClause(db, t))) {
      rows++;
      h.update(row.map(canonical).join('\u0001'));
      h.update('\u0002');
    }
    out[t] = { rows, sha256: h.digest('hex') };
  }
  return out;
}

/**
 * TEXT values that contain a NUL character, per table. They are stored and
 * migrated intact, but node:sqlite in Node 22 returns such text cut at the
 * NUL to the Worker, so the report points them out.
 */
export function textWithNul(db) {
  const out = {};
  for (const t of userTables(db)) {
    const cols = db.prepare(`PRAGMA table_info(${quoteIdent(t)})`).all().map((c) => c.name);
    if (!cols.length) continue;
    const where = cols.map((c) => `(typeof(${quoteIdent(c)}) = 'text' AND instr(CAST(${quoteIdent(c)} AS BLOB), X'00') > 0)`).join(' OR ');
    const n = Number(db.prepare(`SELECT count(*) AS n FROM ${quoteIdent(t)} WHERE ${where}`).get().n);
    if (n) out[t] = n;
  }
  return out;
}

/**
 * Text values that contain a line break, per table. `wrangler d1 export`
 * encodes exactly these with replace(...,'\n',char(10)), which cannot keep a
 * backslash-n that was already in the text: repair-text-from-d1.mjs checks
 * them against D1.
 */
export function multilineText(db) {
  const out = {};
  for (const t of userTables(db)) {
    const cols = db.prepare(`PRAGMA table_info(${quoteIdent(t)})`).all().map((c) => c.name);
    if (!cols.length) continue;
    const where = cols.map((c) => `(typeof(${quoteIdent(c)}) = 'text' AND (instr(${quoteIdent(c)}, char(10)) > 0 OR instr(${quoteIdent(c)}, char(13)) > 0))`).join(' OR ');
    const n = Number(db.prepare(`SELECT count(*) AS n FROM ${quoteIdent(t)} WHERE ${where}`).get().n);
    if (n) out[t] = n;
  }
  return out;
}

/** Columns that hold R2 object keys, and how the app wrote each object. */
export const R2_KEY_COLUMNS = [
  { table: 'attachments', column: 'r2_key' },
  { table: 'users', column: 'avatar_key' },
  { table: 'workspaces', column: 'logo_key' },
];
const NOT_R2_KEY_COLUMNS = new Set(['rate_limits.key', 'system_kv.key', 'notifications.dedupe_key', 'automation_runs.event_key', 'd1_migrations.name']);

/** Columns named like object keys that the scripts do not know (a future migration may have added one). */
export function unknownKeyColumns(db) {
  const known = new Set(R2_KEY_COLUMNS.map((c) => `${c.table}.${c.column}`));
  const out = [];
  for (const t of userTables(db)) {
    for (const c of tableInfo(db, t).columns) {
      const id = `${t}.${c}`;
      if ((/_key$/.test(c) || /^r2_/.test(c) || /_r2$/.test(c)) && !known.has(id) && !NOT_R2_KEY_COLUMNS.has(id)) out.push(id);
    }
  }
  return out;
}

/** Every R2 object the database references, with what the app stored alongside it. */
export function referencedObjects(db) {
  const refs = [];
  const has = (t) => !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(t);
  if (has('attachments')) {
    for (const a of db.prepare('SELECT id, scope, r2_key, content_type, size, uploader_id, created_at, deleted_at FROM attachments ORDER BY id').all()) {
      refs.push({
        kind: 'attachment',
        id: a.id,
        key: a.r2_key,
        contentType: a.content_type,
        size: Number(a.size),
        customMetadata: a.scope === 'item' ? { uploader: a.uploader_id } : {},
        uploaded: Number(a.created_at),
        deleted: a.deleted_at !== null,
      });
    }
  }
  if (has('users')) for (const u of db.prepare('SELECT id, avatar_key, updated_at FROM users WHERE avatar_key IS NOT NULL ORDER BY id').all()) refs.push({ kind: 'avatar', id: u.id, key: u.avatar_key, uploaded: Number(u.updated_at), deleted: false });
  if (has('workspaces')) for (const w of db.prepare('SELECT id, logo_key, updated_at FROM workspaces WHERE logo_key IS NOT NULL ORDER BY id').all()) refs.push({ kind: 'logo', id: w.id, key: w.logo_key, uploaded: Number(w.updated_at), deleted: false });
  return refs;
}

/** The image type the app's upload check would give these bytes (avatars and logos are images only). */
export function sniffImageType(bytes) {
  const b = bytes;
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return 'image/gif';
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45) return 'image/webp';
  return null;
}

export function fsyncPath(path) {
  let fd;
  try {
    fd = openSync(path, 'r');
    fsyncSync(fd);
  } catch {
    /* directories cannot be fsynced on every platform */
  } finally {
    if (fd !== undefined) closeSync(fd);
  }
}

/** Writes a file atomically (temp file, fsync, rename, fsync of the directory). */
export function writeFileAtomic(path, data) {
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync(tmp, data);
  fsyncPath(tmp);
  renameSync(tmp, path);
  fsyncPath(dirname(path));
}

export const REPORT_JSON = 'migration-report.json';
export const REPORT_MD = 'migration-report.md';

export function loadReport(dataDir) {
  const p = join(dataDir, REPORT_JSON);
  if (!existsSync(p)) return {};
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    return {};
  }
}

const cell = (v) => String(v ?? '').replace(/\|/g, '\\|');
const table = (head, rows) => (rows.length ? [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)].join('\n') : '_none_');

export function renderReport(r) {
  const out = ['# Migration report', '', 'Generated by scripts/migrate. Counts, keys that are ids, and checksums only: no row content.', ''];
  if (r.import) {
    const i = r.import;
    out.push('## Database import', '');
    out.push(`- Result: **${i.ok ? 'imported' : 'NOT imported'}**${i.reasons?.length ? ` (${i.reasons.join('; ')})` : ''}`);
    out.push(`- Dump: ${i.dump?.file} (${i.dump?.bytes} bytes, sha256 ${i.dump?.sha256})`);
    out.push(`- At: ${i.at}; replaced an existing database: ${i.replaced ? `yes, copy kept at ${i.backup}` : 'no'}`);
    if (i.previousRun) out.push(`- Same dump imported before: checksums ${i.previousRun.identical ? 'identical' : 'DIFFERENT'} (${i.previousRun.at})`);
    out.push(`- Integrity check: ${i.integrity?.length ? i.integrity.join('; ') : 'ok'}`);
    out.push(`- Schema compared with migrations/: ${i.schema?.differences?.length ? i.schema.differences.join('; ') : 'identical'}`);
    out.push(`- Migrations: applied ${i.migrations?.applied?.length ?? 0} (${(i.migrations?.applied ?? []).join(', ')}); pending ${(i.migrations?.pending ?? []).join(', ') || 'none'}; unknown ${(i.migrations?.unknown ?? []).join(', ') || 'none'}`);
    if (i.nulFixups) out.push(`- Statements with NUL bytes rewritten to char(0): ${i.nulFixups}`);
    if (i.multilineText && Object.keys(i.multilineText).length) out.push(`- Rows with multi-line text (the D1 export cannot keep a backslash-n inside them; check with repair-text-from-d1.mjs): ${Object.entries(i.multilineText).map(([t, n]) => `${t} ${n}`).join(', ')}`);
    if (i.textWithNul && Object.keys(i.textWithNul).length) out.push(`- Text values containing a NUL character (stored intact; node:sqlite in Node 22 returns them cut at the NUL): ${Object.entries(i.textWithNul).map(([t, n]) => `${t} ${n}`).join(', ')}`);
    out.push('', '### Rows per table', '');
    out.push(table(['Table', 'Rows in dump', 'Rows in database', 'Checksum (sha256)'], Object.entries(i.tables ?? {}).map(([t, v]) => [t, v.dump, v.database, v.sha256?.slice(0, 16)])));
    out.push('', '### Rows that failed to insert', '', table(['Table', 'Primary key', 'Reason'], (i.failedRows ?? []).map((f) => [f.table, f.primaryKey, f.reason])));
    out.push('', '### Duplicate primary keys', '', table(['Table', 'Primary key'], (i.duplicates ?? []).map((d) => [d.table, d.primaryKey])));
    out.push('', '### Missing relationships (foreign key check)', '', table(['Table', 'Primary key', 'Column', 'References'], (i.foreignKeyViolations ?? []).map((v) => [v.table, v.primaryKey, v.column, v.parent])));
    if (i.unknownKeyColumns?.length) out.push('', `Columns that look like object keys but are not copied by copy-r2-objects.mjs: ${i.unknownKeyColumns.join(', ')}`);
    out.push('');
  }
  if (r.files) {
    const f = r.files;
    out.push('## Files (R2 objects)', '');
    out.push(`- Source: ${f.source}; at ${f.at}`);
    out.push(`- Referenced by the database: ${f.referenced} (${f.byKind ? Object.entries(f.byKind).map(([k, v]) => `${k} ${v}`).join(', ') : ''})`);
    out.push(`- Copied: ${f.copied}; already present and identical: ${f.alreadyPresent}; verified after copy: ${f.verified}`);
    out.push(`- Total bytes: ${f.bytes}`);
    out.push('', '### Missing objects', '', table(['Kind', 'Row id', 'Note'], (f.missing ?? []).map((m) => [m.kind, m.id, m.note ?? ''])));
    out.push('', '### Size mismatches (database size vs object size)', '', table(['Kind', 'Row id', 'Database', 'Object'], (f.sizeMismatches ?? []).map((m) => [m.kind, m.id, m.expected, m.actual])));
    out.push('', '### Verification failures', '', table(['Kind', 'Row id', 'Problem'], (f.verifyFailures ?? []).map((m) => [m.kind, m.id, m.problem])));
    out.push('');
  }
  if (r.textRepair) {
    const t = r.textRepair;
    out.push('## Multi-line text checked against D1', '');
    out.push(`- Source: ${t.source}; at ${t.at}`);
    out.push(`- Values compared: ${t.checked.values} in ${t.checked.tables} tables; repaired: ${t.repaired.length}; unexpected differences: ${t.unexpected.length}`);
    out.push('', table(['Table', 'Primary key', 'Column'], t.repaired.map((x) => [x.table, x.primaryKey, x.column])), '');
  }
  if (r.verify) {
    const v = r.verify;
    out.push('## Data directory verification', '');
    out.push(`- Result: **${v.ok ? 'ok' : 'PROBLEMS FOUND'}** at ${v.at}`);
    for (const p of v.problems ?? []) out.push(`- Problem: ${p}`);
    for (const w of v.warnings ?? []) out.push(`- Note: ${w}`);
    out.push(`- Tables: ${Object.keys(v.tables ?? {}).length}; rows: ${Object.values(v.tables ?? {}).reduce((s, t) => s + t.rows, 0)}`);
    out.push(`- Files checked: ${v.files?.checked ?? 0}, missing ${v.files?.missing ?? 0}, size or checksum mismatches ${v.files?.mismatched ?? 0}, unreferenced files ${v.files?.unreferenced ?? 0}`);
    out.push('');
  }
  if (r.export) {
    const e = r.export;
    out.push('## Export for D1 (rollback)', '');
    out.push(`- File: ${e.file} (${e.bytes} bytes, sha256 ${e.sha256}); round trip ${e.roundTrip ? 'verified' : 'NOT verified'}`);
    out.push('', table(['Table', 'Rows exported'], Object.entries(e.tables ?? {}).map(([t, n]) => [t, n])));
    if (e.files) out.push('', `- Files written for R2 upload: ${e.files.count} (${e.files.bytes} bytes) in ${e.files.dir}`);
    out.push('');
  }
  return out.join('\n');
}

export function saveReport(dataDir, report) {
  writeFileAtomic(join(dataDir, REPORT_JSON), `${JSON.stringify(report, null, 2)}\n`);
  writeFileAtomic(join(dataDir, REPORT_MD), `${renderReport(report)}\n`);
}

export function die(message, code = 1) {
  console.error(message);
  process.exit(code);
}
