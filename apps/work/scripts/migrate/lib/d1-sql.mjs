// The rows of a Project Management database as SQL files for D1 (`wrangler d1 execute <db> --remote --file <part>`),
// for to-cloudflare.mjs. The D1 database gets its schema from `wrangler d1 migrations apply`, so the files hold rows
// only. What D1 accepts, and how these files keep to it:
//
//   - One statement at most 100,000 bytes. A row whose INSERT would be longer is inserted with its longest text and
//     blob values empty, and UPDATE statements append them in pieces.
//   - Every value exactly as stored. Integers as SQL integers (all 64 bits). REAL values as an integer times a power
//     of two, each step exact, so the double does not depend on how a SQLite version reads decimal text (whole numbers
//     up to 2^53 as N.0). Text that is not printable ASCII as CAST(X'..' AS TEXT): its bytes as stored, line breaks,
//     NUL and invalid UTF-8 included. Blobs as X'..' (appended pieces through CAST(.. AS BLOB), as || makes text).
//     The files are plain ASCII, one statement per line.
//   - Tables parents first (by their foreign keys), and the rows of a table that refers to itself parents first, so
//     every statement refers only to rows inserted before it, in the same file or an earlier one. Each file also
//     starts with PRAGMA defer_foreign_keys=TRUE, as `wrangler d1 export` writes.
//   - No internal tables: sqlite_*, _cf_* (D1's) and d1_* (d1_migrations: wrangler fills it while it migrates).
//
// Nothing here prints or returns a value of a row, only names, counts, sizes and checksums.

import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { quoteIdent, tableInfo } from './common.mjs';

/** D1's limit on the length of one SQL statement, in bytes. */
export const D1_STATEMENT_LIMIT = 100_000;
/** D1's limit on one string, blob or row (SQLITE_MAX_LENGTH), in bytes. */
export const D1_ROW_LIMIT = 2_000_000;
/** The longest statement written here (a margin under D1_STATEMENT_LIMIT). */
export const STATEMENT_BYTES = 90_000;
/** The longest literal of one appended piece. */
const PIECE_CHARS = 60_000;
/** A part file is closed before it grows past this, unless one row alone needs more. */
export const DEFAULT_PART_BYTES = 4 * 1024 * 1024;
export const DEFER = 'PRAGMA defer_foreign_keys=TRUE;';

const EMPTY = new Uint8Array(0);

/** Tables D1 or wrangler own, or SQLite itself. */
export const isInternalTable = (name) => /^(sqlite_|_cf_|d1_)/i.test(String(name));

/** The application's tables, by name. */
export function dataTables(db) {
  return db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")
    .all()
    .map((r) => String(r.name))
    .filter((n) => !isInternalTable(n));
}

/** A TEXT value as its stored bytes (UTF-8 as SQLite holds it, which need not be valid UTF-8). */
export class Text {
  constructor(bytes) {
    this.bytes = bytes;
  }
}

/**
 * Rows with every value exactly as stored: null, bigint (INTEGER), number (REAL), Text (TEXT, as bytes: read with
 * CAST AS BLOB, so a NUL or invalid UTF-8 survives) and Buffer (BLOB).
 */
export function* rawRows(db, table, columns, orderBy) {
  const q = columns.map(quoteIdent);
  const select = q.map((c) => `typeof(${c}), CASE WHEN typeof(${c}) = 'text' THEN CAST(${c} AS BLOB) ELSE ${c} END`).join(', ');
  const stmt = db.prepare(`SELECT ${select} FROM ${quoteIdent(table)}${orderBy ? ` ORDER BY ${orderBy}` : ''}`);
  stmt.setReadBigInts(true);
  stmt.setReturnArrays(true);
  for (const raw of stmt.iterate()) {
    const row = new Array(columns.length);
    for (let i = 0; i < columns.length; i++) {
      const type = raw[2 * i];
      const v = raw[2 * i + 1];
      row[i] = type === 'text' ? new Text(Buffer.from(v ?? EMPTY)) : type === 'blob' ? Buffer.from(v ?? EMPTY) : type === 'null' ? null : v;
    }
    yield row;
  }
}

const asBuffer = (u8) => Buffer.from(u8.buffer, u8.byteOffset, u8.byteLength);

function printableAscii(b) {
  for (let i = 0; i < b.length; i++) if (b[i] < 0x20 || b[i] > 0x7e) return false;
  return true;
}

export function textLiteral(bytes) {
  const b = asBuffer(bytes);
  return printableAscii(b) ? `'${b.toString('latin1').replace(/'/g, "''")}'` : `CAST(X'${b.toString('hex')}' AS TEXT)`;
}

const F64 = new DataView(new ArrayBuffer(8));
const TWO_62 = 1n << 62n;

/** A REAL value that every SQLite reads back as the same double (see the header). */
export function realLiteral(v) {
  if (Number.isNaN(v)) return 'NULL'; // SQLite stores NaN as NULL, so a database never holds one
  if (v === Infinity) return '9e999';
  if (v === -Infinity) return '-9e999';
  if (v === 0) return Object.is(v, -0) ? '-0.0' : '0.0';
  if (Number.isInteger(v) && Math.abs(v) <= 2 ** 53) return `${v}.0`;
  F64.setFloat64(0, v);
  const hi = F64.getUint32(0);
  const lo = F64.getUint32(4);
  const biased = (hi >>> 20) & 0x7ff;
  let m = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo);
  let e = -1074; // subnormal
  if (biased !== 0) {
    m |= 1n << 52n;
    e = biased - 1075;
  }
  while ((m & 1n) === 0n) {
    m >>= 1n;
    e++;
  }
  // v = m * 2^e, m an odd integer below 2^53: CAST(m AS REAL) is exact, and so is each multiplication or division by
  // a power of two (no intermediate value overflows or loses a bit, as v itself is a double).
  let expr = `CAST(${hi >>> 31 ? '-' : ''}${m} AS REAL)`;
  const op = e > 0 ? '*' : '/';
  let k = Math.abs(e);
  for (; k >= 62; k -= 62) expr += ` ${op} ${TWO_62}`;
  if (k > 0) expr += ` ${op} ${1n << BigInt(k)}`;
  return `(${expr})`;
}

export function literal(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'bigint') return v.toString();
  if (typeof v === 'number') return realLiteral(v);
  if (v instanceof Text) return textLiteral(v.bytes);
  if (v instanceof Uint8Array) return `X'${asBuffer(v).toString('hex')}'`;
  throw new Error(`a value of type ${typeof v} cannot be written as SQL`);
}

/** Bytes a value takes in a row, near enough for D1's row limit. */
function valueBytes(v) {
  if (v instanceof Text) return v.bytes.length;
  if (v instanceof Uint8Array) return v.length;
  return 9;
}

/** Literals of consecutive pieces of a text or blob, each at most maxChars long. */
function* pieces(v, maxChars) {
  if (v instanceof Text) {
    const b = asBuffer(v.bytes);
    if (printableAscii(b)) {
      let start = 0;
      let len = 2;
      for (let i = 0; i < b.length; i++) {
        const w = b[i] === 0x27 ? 2 : 1;
        if (len + w > maxChars) {
          yield textLiteral(b.subarray(start, i));
          start = i;
          len = 2;
        }
        len += w;
      }
      yield textLiteral(b.subarray(start));
      return;
    }
    const step = Math.floor((maxChars - 24) / 2);
    for (let start = 0; start < b.length; ) {
      let end = Math.min(b.length, start + step);
      // keep the bytes of one character together: no piece starts with a UTF-8 continuation byte (10xxxxxx)
      for (let back = 0; end < b.length && back < 3 && (b[end] & 0xc0) === 0x80; back++) end--;
      if (end <= start) end = Math.min(b.length, start + step);
      yield textLiteral(b.subarray(start, end));
      start = end;
    }
    return;
  }
  const b = asBuffer(v);
  const step = Math.floor((maxChars - 4) / 2);
  for (let start = 0; start < b.length; start += step) yield `X'${b.subarray(start, start + step).toString('hex')}'`;
}

export class RowTooLarge extends Error {}

/** The statements that insert one row: one INSERT, or an INSERT and the UPDATEs that append its long values. */
export function rowStatements(t, row) {
  const lits = row.map(literal);
  const head = `INSERT INTO ${quoteIdent(t.name)} (${t.columns.map(quoteIdent).join(',')}) VALUES(`;
  const insert = (values) => `${head}${values.join(',')});`;
  const first = insert(lits);
  if (first.length <= STATEMENT_BYTES) return [first];
  if (!t.pk.length) throw new RowTooLarge(`a row of ${t.name} is too long for one D1 statement and the table has no primary key`);
  const pkIndex = new Set(t.pk.map((c) => t.columns.indexOf(c)));
  const longest = lits
    .map((l, i) => i)
    .filter((i) => !pkIndex.has(i) && (row[i] instanceof Text || row[i] instanceof Uint8Array))
    .sort((a, b) => lits[b].length - lits[a].length || a - b);
  const values = [...lits];
  const moved = [];
  for (const i of longest) {
    if (insert(values).length <= STATEMENT_BYTES) break;
    values[i] = row[i] instanceof Text ? "''" : "X''";
    moved.push(i);
  }
  const out = [insert(values)];
  if (out[0].length > STATEMENT_BYTES) throw new RowTooLarge(`a row of ${t.name} is too long for one D1 statement`);
  const where = t.pk.map((c) => `${quoteIdent(c)} = ${lits[t.columns.indexOf(c)]}`).join(' AND ');
  for (const i of moved.sort((a, b) => a - b)) {
    const c = quoteIdent(t.columns[i]);
    const blob = !(row[i] instanceof Text);
    for (const piece of pieces(row[i], PIECE_CHARS)) {
      const s = blob
        ? `UPDATE ${quoteIdent(t.name)} SET ${c} = CAST(${c} || ${piece} AS BLOB) WHERE ${where};`
        : `UPDATE ${quoteIdent(t.name)} SET ${c} = ${c} || ${piece} WHERE ${where};`;
      if (s.length > STATEMENT_BYTES) throw new RowTooLarge(`a row of ${t.name} has a primary key too long for one D1 statement`);
      out.push(s);
    }
  }
  return out;
}

/** Foreign keys of a table: the parent table and the columns on both sides (to: null means the parent's primary key). */
export function foreignKeys(db, table) {
  const byId = new Map();
  for (const r of db.prepare(`PRAGMA foreign_key_list(${quoteIdent(table)})`).all()) {
    const id = Number(r.id);
    if (!byId.has(id)) byId.set(id, { parent: String(r.table), from: [], to: [] });
    const fk = byId.get(id);
    fk.from[Number(r.seq)] = String(r.from);
    fk.to[Number(r.seq)] = r.to === null || r.to === undefined ? null : String(r.to);
  }
  return [...byId.values()];
}

/**
 * The load plan: every data table with its columns, primary key and references to itself, parents before the tables
 * that refer to them (ties by name). Throws when tables refer to each other in a circle.
 */
export function loadPlan(db, tables = dataTables(db)) {
  const byLower = new Map(tables.map((t) => [t.toLowerCase(), t]));
  const deps = new Map(tables.map((t) => [t, new Set()]));
  const info = new Map();
  for (const t of tables) {
    const { columns, pk, withoutRowid } = tableInfo(db, t);
    const selfRefs = [];
    for (const fk of foreignKeys(db, t)) {
      const parent = byLower.get(fk.parent.toLowerCase());
      if (parent === t) selfRefs.push({ from: fk.from, to: fk.to.some((c) => c === null) ? pk : fk.to });
      else if (parent) deps.get(t).add(parent);
    }
    info.set(t, { name: t, columns, pk, withoutRowid, selfRefs });
  }
  const order = [];
  const done = new Set();
  while (order.length < tables.length) {
    const ready = tables.filter((t) => !done.has(t) && [...deps.get(t)].every((p) => done.has(p))).sort();
    if (!ready.length) {
      const left = tables.filter((t) => !done.has(t));
      throw new Error(`these tables refer to each other in a circle, so no order inserts parents first: ${left.join(', ')}`);
    }
    for (const t of ready) {
      order.push(info.get(t));
      done.add(t);
    }
  }
  return order;
}

function keyOf(v) {
  if (v === null) return null;
  if (v instanceof Text) return `s${asBuffer(v.bytes).toString('latin1')}`;
  if (v instanceof Uint8Array) return `b${asBuffer(v).toString('hex')}`;
  return `${typeof v === 'bigint' ? 'i' : 'r'}${String(v)}`;
}

/** Rows of a table that refers to itself, each after the row it refers to (otherwise in their stored order). */
export function parentsFirst(rows, t) {
  const col = (c) => t.columns.indexOf(c);
  const key = (row, cols) => {
    const parts = cols.map((c) => keyOf(row[col(c)]));
    return parts.some((p) => p === null) ? null : parts.join('\u0001');
  };
  const parents = rows.map(() => []);
  for (const ref of t.selfRefs) {
    const index = new Map();
    rows.forEach((row, i) => {
      const k = key(row, ref.to);
      if (k !== null && !index.has(k)) index.set(k, i);
    });
    rows.forEach((row, i) => {
      const k = key(row, ref.from);
      const p = k === null ? undefined : index.get(k);
      if (p !== undefined && p !== i) parents[i].push(p);
    });
  }
  const state = new Uint8Array(rows.length); // 0 new, 1 waiting for its parents, 2 placed
  const out = [];
  for (let i = 0; i < rows.length; i++) {
    const stack = [i];
    while (stack.length) {
      const n = stack[stack.length - 1];
      if (state[n] === 2) {
        stack.pop();
        continue;
      }
      state[n] = 1;
      const next = parents[n].find((p) => state[p] !== 2);
      if (next === undefined) {
        state[n] = 2;
        out.push(rows[n]);
        stack.pop();
      } else if (state[next] === 1) throw new Error(`rows of ${t.name} refer to each other in a circle`);
      else stack.push(next);
    }
  }
  return out;
}

function* rowsInLoadOrder(db, t) {
  const orderBy = t.withoutRowid ? t.pk.map(quoteIdent).join(', ') : 'rowid';
  if (!t.selfRefs.length) yield* rawRows(db, t.name, t.columns, orderBy);
  else yield* parentsFirst([...rawRows(db, t.name, t.columns, orderBy)], t);
}

/**
 * Writes the rows as part-0001.sql, part-0002.sql, ... in outDir, in the order of the plan. A row's statements always
 * stay in one part. Returns the parts (file, statements, rows, bytes), rows per table, the number of rows written in
 * pieces, and the tables with rows larger than D1 accepts (nothing is written for those rows).
 */
export function writeParts(db, plan, outDir, { partBytes = DEFAULT_PART_BYTES } = {}) {
  const parts = [];
  const rows = {};
  const tooLarge = {};
  let inPieces = 0;
  let cur = null;
  const flush = () => {
    if (!cur) return;
    const file = `part-${String(parts.length + 1).padStart(4, '0')}.sql`;
    writeFileSync(join(outDir, file), `${cur.lines.join('\n')}\n`);
    parts.push({ file, statements: cur.statements, rows: cur.rows, bytes: cur.bytes });
    cur = null;
  };
  for (const t of plan) {
    rows[t.name] = 0;
    for (const row of rowsInLoadOrder(db, t)) {
      rows[t.name]++;
      if (row.reduce((s, v) => s + valueBytes(v), 0) > D1_ROW_LIMIT) {
        tooLarge[t.name] = (tooLarge[t.name] ?? 0) + 1;
        continue;
      }
      let stmts;
      try {
        stmts = rowStatements(t, row);
      } catch (e) {
        if (!(e instanceof RowTooLarge)) throw e;
        tooLarge[t.name] = (tooLarge[t.name] ?? 0) + 1;
        continue;
      }
      if (stmts.some((s) => s.includes('\n'))) throw new Error(`a statement for ${t.name} spans lines (an identifier with a line break)`);
      if (stmts.length > 1) inPieces++;
      const size = stmts.reduce((s, x) => s + x.length + 1, 0);
      if (cur && cur.statements && cur.bytes + size > partBytes) flush();
      cur ??= { lines: [DEFER], bytes: DEFER.length + 1, statements: 0, rows: 0 };
      cur.lines.push(...stmts);
      cur.bytes += size;
      cur.statements += stmts.length;
      cur.rows++;
    }
  }
  flush();
  return { parts, rows, inPieces, tooLarge };
}

/** Deletes the rows of every table of the plan, children first (the reverse of the load order). */
export function clearSql(plan) {
  return `${[DEFER, ...[...plan].reverse().map((t) => `DELETE FROM ${quoteIdent(t.name)};`)].join('\n')}\n`;
}

function canonical(h, v) {
  if (v === null) h.update('n');
  else if (typeof v === 'bigint') h.update(`i${v};`);
  else if (typeof v === 'number') h.update(`r${Object.is(v, -0) ? '-0' : String(v)};`);
  else {
    const b = asBuffer(v instanceof Text ? v.bytes : v);
    h.update(`${v instanceof Text ? 's' : 'b'}${b.length}:`);
    h.update(b);
  }
}

/** Rows and SHA-256 of each table over its exact values (text as bytes), in primary-key order (or by every column). */
export function rawChecksums(db, tables) {
  const out = {};
  for (const t of tables) {
    const { columns, pk } = tableInfo(db, t);
    const orderBy = pk.length ? pk.map(quoteIdent).join(', ') : columns.map((_, i) => String(i + 1)).join(', ');
    const h = createHash('sha256');
    let n = 0;
    for (const row of rawRows(db, t, columns, orderBy)) {
      n++;
      for (const v of row) canonical(h, v);
      h.update('\u0002');
    }
    out[t] = { rows: n, sha256: h.digest('hex') };
  }
  return out;
}

const sqlString = (s) => `'${String(s).replace(/'/g, "''")}'`;

/**
 * One SELECT that sums up a table without showing any of it: t (its name), n (rows), b (bytes of its text and blob
 * values), z (NULL values), r (REAL values) and i (the sum of its integers, each modulo 1000003). The same SQL runs in
 * the copy here and in D1, so equal results mean the rows arrived whole. total() adds in floating point, which is
 * exact for these sums (whole numbers far below 2^53), and gives 0 for an empty table.
 */
export function fingerprintSql(table, columns) {
  const q = columns.map(quoteIdent);
  const sum = (expr) => (q.length ? q.map((c) => `total(${expr(c)})`).join('+') : '0');
  return (
    `SELECT ${sqlString(table)} AS t, count(*) AS n` +
    `, ${sum((c) => `(typeof(${c}) IN ('text','blob'))*length(CAST(${c} AS BLOB))`)} AS b` +
    `, ${sum((c) => `${c} IS NULL`)} AS z` +
    `, ${sum((c) => `typeof(${c})='real'`)} AS r` +
    `, ${sum((c) => `(typeof(${c})='integer')*(${c}%1000003)`)} AS i` +
    ` FROM ${quoteIdent(table)}`
  );
}

export const FINGERPRINT_FIELDS = ['n', 'b', 'z', 'r', 'i'];

/** The fingerprint of each table, computed here (node:sqlite). */
export function localFingerprints(db, tables) {
  const out = {};
  for (const t of tables) {
    const r = db.prepare(fingerprintSql(t.name, t.columns)).get();
    out[t.name] = Object.fromEntries(FINGERPRINT_FIELDS.map((f) => [f, Number(r[f])]));
  }
  return out;
}

/**
 * The fingerprint SELECTs in groups, each group one `wrangler d1 execute --command` (statements joined by ;), short
 * enough for a Windows command line (32,767 characters in all).
 */
export function fingerprintBatches(tables, maxChars = 24_000) {
  const batches = [];
  let cur = [];
  let len = 0;
  for (const t of tables) {
    const s = fingerprintSql(t.name, t.columns);
    if (cur.length && len + s.length + 2 > maxChars) {
      batches.push(cur);
      cur = [];
      len = 0;
    }
    cur.push(s);
    len += s.length + 2;
  }
  if (cur.length) batches.push(cur);
  return batches.map((b) => `${b.join(';\n')};`);
}
