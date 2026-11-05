// Small SQLite tokenizer for the D1 binding.
//
// node:sqlite compiles only the first statement of a string and binds missing
// parameters as NULL, while D1 runs every statement and rejects a wrong number
// of bindings. This lexer gives the binding what it needs to behave like D1:
// the statements of a string (split on `;` outside quotes, comments and
// CREATE TRIGGER bodies), the parameter count of each statement (SQLite's
// numbering rules for `?`, `?NNN`, `:name`, `@name`, `$name`) and the leading
// keyword (to refuse transaction statements and unauthorised PRAGMAs).

export interface SqlStatement {
  /**
   * Statement text, trimmed, without the terminating semicolon. Named
   * parameters (:a, @a, $a) are rewritten to the numbered form SQLite gives
   * them (?1, ?2, ...): D1 binds them by position, node:sqlite would not.
   */
  text: string;
  /** Leading keyword in upper case (SELECT, INSERT, WITH, PRAGMA, ...); '' if none. */
  keyword: string;
  /** Number of parameter slots, as sqlite3_bind_parameter_count() reports it. */
  paramCount: number;
  /** For PRAGMA statements: the pragma name in lower case. */
  pragma?: string;
}

export interface SqlAnalysis {
  statements: SqlStatement[];
  /** True when a `;` closed a statement without any token (for example "SELECT 1;;"). */
  emptyStatement: boolean;
}

type Kind = 'word' | 'ident' | 'string' | 'number' | 'param' | 'punct';
interface Token {
  kind: Kind;
  value: string;
}

const HEAD_TOKENS = 6;
const isWordStart = (c: string) => (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c === '_' || c.charCodeAt(0) > 0x7f;
const isWordChar = (c: string) => isWordStart(c) || (c >= '0' && c <= '9') || c === '$';
const isSpace = (c: string) => c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\f' || c === '\v';

class Pending {
  head: Token[] = [];
  tokens = 0;
  maxIndex = 0;
  names = new Map<string, number>();
  trigger = false;
  caseDepth = 0;
  lastWord = '';
  readonly rewrites: [number, number, string][] = [];
  readonly start: number;
  constructor(start: number) {
    this.start = start;
  }

  add(t: Token) {
    this.tokens++;
    if (this.head.length < HEAD_TOKENS) this.head.push(t);
    if (t.kind !== 'word') {
      this.lastWord = '';
      return;
    }
    const u = t.value.toUpperCase();
    if (!this.trigger && u === 'TRIGGER' && this.head.length <= 3) {
      const h = this.head.map((x) => (x.kind === 'word' ? x.value.toUpperCase() : ''));
      if (h[0] === 'CREATE' && (h[1] === 'TRIGGER' || ((h[1] === 'TEMP' || h[1] === 'TEMPORARY') && h[2] === 'TRIGGER'))) this.trigger = true;
    }
    if (this.trigger) {
      if (u === 'CASE') this.caseDepth++;
      else if (u === 'END' && this.caseDepth > 0) {
        this.caseDepth--;
        this.lastWord = '';
        return;
      }
    }
    this.lastWord = u;
  }

  param(index: number | null, name: string | null, at = 0) {
    if (name !== null) {
      if (!this.names.has(name)) this.names.set(name, ++this.maxIndex);
      this.rewrites.push([at, at + name.length, `?${this.names.get(name)}`]);
    } else if (index !== null) {
      if (index > this.maxIndex) this.maxIndex = index;
    } else this.maxIndex++;
    this.add({ kind: 'param', value: '?' });
  }

  toStatement(sql: string, end: number): SqlStatement {
    const h = this.head;
    const keyword = h[0]?.kind === 'word' ? h[0].value.toUpperCase() : '';
    let text = '';
    let from = this.start;
    for (const [a, b, replacement] of this.rewrites) {
      text += sql.slice(from, a) + replacement;
      from = b;
    }
    text += sql.slice(from, end);
    const stmt: SqlStatement = { text: text.trim(), keyword, paramCount: this.maxIndex };
    if (keyword === 'PRAGMA') {
      const qualified = h[2]?.kind === 'punct' && h[2].value === '.';
      const name = qualified ? h[3] : h[1];
      stmt.pragma = name && (name.kind === 'word' || name.kind === 'ident') ? name.value.toLowerCase() : '';
    }
    return stmt;
  }
}

export function analyzeSql(sql: string): SqlAnalysis {
  const statements: SqlStatement[] = [];
  let emptyStatement = false;
  let cur = new Pending(0);
  const n = sql.length;
  let i = 0;

  while (i < n) {
    const c = sql[i];
    if (isSpace(c)) {
      i++;
      continue;
    }
    if (c === '-' && sql[i + 1] === '-') {
      const nl = sql.indexOf('\n', i + 2);
      i = nl < 0 ? n : nl + 1;
      continue;
    }
    if (c === '/' && sql[i + 1] === '*') {
      const end = sql.indexOf('*/', i + 2);
      i = end < 0 ? n : end + 2;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      let j = i + 1;
      while (j < n) {
        if (sql[j] === c) {
          if (sql[j + 1] === c) {
            j += 2;
            continue;
          }
          break;
        }
        j++;
      }
      const body = sql.slice(i + 1, j);
      cur.add(c === "'" ? { kind: 'string', value: body } : { kind: 'ident', value: body.split(c + c).join(c) });
      i = j + 1;
      continue;
    }
    if (c === '[') {
      const end = sql.indexOf(']', i + 1);
      const j = end < 0 ? n : end;
      cur.add({ kind: 'ident', value: sql.slice(i + 1, j) });
      i = j + 1;
      continue;
    }
    if (c === '?') {
      let j = i + 1;
      while (j < n && sql[j] >= '0' && sql[j] <= '9') j++;
      cur.param(j > i + 1 ? Number.parseInt(sql.slice(i + 1, j), 10) : null, null);
      i = j;
      continue;
    }
    if ((c === ':' || c === '@' || c === '$') && i + 1 < n && isWordChar(sql[i + 1])) {
      let j = i + 1;
      while (j < n && isWordChar(sql[j])) j++;
      cur.param(null, sql.slice(i, j), i);
      i = j;
      continue;
    }
    if (c === ';') {
      if (cur.trigger && cur.lastWord !== 'END') {
        cur.add({ kind: 'punct', value: ';' });
        i++;
        continue;
      }
      if (cur.tokens === 0) emptyStatement = true;
      else statements.push(cur.toStatement(sql, i));
      i++;
      cur = new Pending(i);
      continue;
    }
    if (isWordStart(c)) {
      let j = i + 1;
      while (j < n && isWordChar(sql[j])) j++;
      cur.add({ kind: 'word', value: sql.slice(i, j) });
      i = j;
      continue;
    }
    if ((c >= '0' && c <= '9') || (c === '.' && sql[i + 1] >= '0' && sql[i + 1] <= '9')) {
      let j = i + 1;
      while (j < n) {
        const d = sql[j];
        if ((d === 'e' || d === 'E') && (sql[j + 1] === '+' || sql[j + 1] === '-')) j += 2;
        else if (isWordChar(d) || d === '.') j++;
        else break;
      }
      cur.add({ kind: 'number', value: sql.slice(i, j) });
      i = j;
      continue;
    }
    cur.add({ kind: 'punct', value: c });
    i++;
  }
  if (cur.tokens > 0) statements.push(cur.toStatement(sql, n));
  return { statements, emptyStatement };
}
