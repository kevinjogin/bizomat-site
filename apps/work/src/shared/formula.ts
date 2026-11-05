// A small, safe formula language for formula columns. No eval / Function.
//
// Syntax:   {Column title} references, numbers, "strings", true/false,
//           + - * / % ^, & (concatenate), = != < > <= >=, parentheses,
//           FUNCTION(arg, ...).
// Functions: SUM AVG MIN MAX ROUND ABS FLOOR CEIL IF AND OR NOT CONCAT LEN
//            UPPER LOWER TODAY DAYS ADD_DAYS ISBLANK COALESCE

import { addDays, diffDays, isIsoDate, toIsoDate } from './dates';

export type FormulaValue = number | string | boolean | null;

type Token =
  | { t: 'num'; v: number }
  | { t: 'str'; v: string }
  | { t: 'ref'; v: string }
  | { t: 'id'; v: string }
  | { t: 'op'; v: string }
  | { t: '('; v: '(' }
  | { t: ')'; v: ')' }
  | { t: ','; v: ',' };

type Node =
  | { k: 'lit'; v: FormulaValue }
  | { k: 'ref'; name: string }
  | { k: 'un'; op: string; a: Node }
  | { k: 'bin'; op: string; a: Node; b: Node }
  | { k: 'call'; name: string; args: Node[] };

export class FormulaError extends Error {}

const MAX_LEN = 2000;
const MAX_DEPTH = 60;

function tokenize(src: string): Token[] {
  if (src.length > MAX_LEN) throw new FormulaError('Formula is too long');
  const out: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < src.length && /[0-9.]/.test(src[j])) j++;
      const n = Number(src.slice(i, j));
      if (!Number.isFinite(n)) throw new FormulaError('Invalid number');
      out.push({ t: 'num', v: n });
      i = j;
      continue;
    }
    if (c === '"') {
      let j = i + 1;
      let s = '';
      while (j < src.length && src[j] !== '"') {
        if (src[j] === '\\' && j + 1 < src.length) { s += src[j + 1]; j += 2; continue; }
        s += src[j++];
      }
      if (src[j] !== '"') throw new FormulaError('Unterminated string');
      out.push({ t: 'str', v: s });
      i = j + 1;
      continue;
    }
    if (c === '{') {
      const j = src.indexOf('}', i);
      if (j < 0) throw new FormulaError('Unterminated column reference');
      out.push({ t: 'ref', v: src.slice(i + 1, j).trim() });
      i = j + 1;
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
      out.push({ t: 'id', v: src.slice(i, j).toUpperCase() });
      i = j;
      continue;
    }
    const two = src.slice(i, i + 2);
    if (['<=', '>=', '!=', '<>'].includes(two)) { out.push({ t: 'op', v: two === '<>' ? '!=' : two }); i += 2; continue; }
    if ('+-*/%^&=<>'.includes(c)) { out.push({ t: 'op', v: c }); i++; continue; }
    if (c === '(') { out.push({ t: '(', v: '(' }); i++; continue; }
    if (c === ')') { out.push({ t: ')', v: ')' }); i++; continue; }
    if (c === ',') { out.push({ t: ',', v: ',' }); i++; continue; }
    throw new FormulaError(`Unexpected character "${c}"`);
  }
  return out;
}

const PREC: Record<string, number> = { '=': 1, '!=': 1, '<': 1, '>': 1, '<=': 1, '>=': 1, '&': 2, '+': 3, '-': 3, '*': 4, '/': 4, '%': 4, '^': 5 };

function parse(tokens: Token[]): Node {
  let pos = 0;
  let depth = 0;
  const peek = () => tokens[pos];
  const primary = (): Node => {
    if (++depth > MAX_DEPTH) throw new FormulaError('Formula is nested too deeply');
    try {
      const tk = tokens[pos++];
      if (!tk) throw new FormulaError('Unexpected end of formula');
      if (tk.t === 'num') return { k: 'lit', v: tk.v };
      if (tk.t === 'str') return { k: 'lit', v: tk.v };
      if (tk.t === 'ref') return { k: 'ref', name: tk.v };
      if (tk.t === 'op' && (tk.v === '-' || tk.v === '+')) return { k: 'un', op: tk.v, a: expr(6) };
      if (tk.t === '(') {
        const e = expr(0);
        if (tokens[pos++]?.t !== ')') throw new FormulaError('Missing )');
        return e;
      }
      if (tk.t === 'id') {
        if (tk.v === 'TRUE') return { k: 'lit', v: true };
        if (tk.v === 'FALSE') return { k: 'lit', v: false };
        if (peek()?.t !== '(') throw new FormulaError(`Unknown name ${tk.v}`);
        pos++;
        const args: Node[] = [];
        if (peek()?.t !== ')') {
          for (;;) {
            args.push(expr(0));
            if (peek()?.t === ',') { pos++; continue; }
            break;
          }
        }
        if (tokens[pos++]?.t !== ')') throw new FormulaError('Missing ) after arguments');
        return { k: 'call', name: tk.v, args };
      }
      throw new FormulaError('Unexpected token');
    } finally {
      depth--;
    }
  };
  const expr = (minPrec: number): Node => {
    let left = primary();
    for (;;) {
      const tk = peek();
      if (!tk || tk.t !== 'op') break;
      const p = PREC[tk.v];
      if (p === undefined || p < minPrec) break;
      pos++;
      const right = expr(tk.v === '^' ? p : p + 1);
      left = { k: 'bin', op: tk.v, a: left, b: right };
    }
    return left;
  };
  const n = expr(0);
  if (pos < tokens.length) throw new FormulaError('Unexpected input after formula');
  return n;
}

const num = (v: FormulaValue): number => {
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (v == null || v === '') return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const text = (v: FormulaValue): string => (v == null ? '' : typeof v === 'number' ? String(Math.round(v * 1e6) / 1e6) : String(v));
const truthy = (v: FormulaValue): boolean => (typeof v === 'string' ? v.length > 0 : !!v);

export interface FormulaEnv {
  resolve: (columnTitle: string) => FormulaValue;
  today?: string;
}

function evaluate(n: Node, env: FormulaEnv): FormulaValue {
  switch (n.k) {
    case 'lit':
      return n.v;
    case 'ref':
      return env.resolve(n.name);
    case 'un':
      return n.op === '-' ? -num(evaluate(n.a, env)) : num(evaluate(n.a, env));
    case 'bin': {
      const a = evaluate(n.a, env);
      const b = evaluate(n.b, env);
      switch (n.op) {
        case '+': return num(a) + num(b);
        case '-': return num(a) - num(b);
        case '*': return num(a) * num(b);
        case '/': return num(b) === 0 ? null : num(a) / num(b);
        case '%': return num(b) === 0 ? null : num(a) % num(b);
        case '^': return Math.pow(num(a), num(b));
        case '&': return text(a) + text(b);
        case '=': return typeof a === 'number' || typeof b === 'number' ? num(a) === num(b) : text(a) === text(b);
        case '!=': return typeof a === 'number' || typeof b === 'number' ? num(a) !== num(b) : text(a) !== text(b);
        case '<': return typeof a === 'string' && typeof b === 'string' ? a < b : num(a) < num(b);
        case '>': return typeof a === 'string' && typeof b === 'string' ? a > b : num(a) > num(b);
        case '<=': return typeof a === 'string' && typeof b === 'string' ? a <= b : num(a) <= num(b);
        case '>=': return typeof a === 'string' && typeof b === 'string' ? a >= b : num(a) >= num(b);
      }
      throw new FormulaError(`Unknown operator ${n.op}`);
    }
    case 'call': {
      const lazy = n.name === 'IF';
      if (lazy) {
        if (n.args.length < 2) throw new FormulaError('IF needs at least 2 arguments');
        return truthy(evaluate(n.args[0], env)) ? evaluate(n.args[1], env) : n.args[2] ? evaluate(n.args[2], env) : null;
      }
      const args = n.args.map((a) => evaluate(a, env));
      const nums = () => args.map(num);
      switch (n.name) {
        case 'SUM': return nums().reduce((s, x) => s + x, 0);
        case 'AVG': return args.length ? nums().reduce((s, x) => s + x, 0) / args.length : null;
        case 'MIN': return args.length ? Math.min(...nums()) : null;
        case 'MAX': return args.length ? Math.max(...nums()) : null;
        case 'ROUND': {
          const f = Math.pow(10, num(args[1] ?? 0));
          return Math.round(num(args[0]) * f) / f;
        }
        case 'ABS': return Math.abs(num(args[0]));
        case 'FLOOR': return Math.floor(num(args[0]));
        case 'CEIL': return Math.ceil(num(args[0]));
        case 'AND': return args.every(truthy);
        case 'OR': return args.some(truthy);
        case 'NOT': return !truthy(args[0]);
        case 'CONCAT': return args.map(text).join('');
        case 'LEN': return text(args[0]).length;
        case 'UPPER': return text(args[0]).toUpperCase();
        case 'LOWER': return text(args[0]).toLowerCase();
        case 'TODAY': return env.today ?? toIsoDate(Date.now());
        case 'DAYS': {
          const [a, b] = args;
          if (!isIsoDate(a) || !isIsoDate(b)) return null;
          return diffDays(b as string, a as string);
        }
        case 'ADD_DAYS': {
          if (!isIsoDate(args[0])) return null;
          return addDays(args[0] as string, Math.round(num(args[1])));
        }
        case 'ISBLANK': return args[0] == null || args[0] === '';
        case 'COALESCE': return args.find((a) => a != null && a !== '') ?? null;
      }
      throw new FormulaError(`Unknown function ${n.name}`);
    }
  }
}

const cache = new Map<string, Node>();

export function compileFormula(src: string): Node {
  const hit = cache.get(src);
  if (hit) return hit;
  const node = parse(tokenize(src));
  if (cache.size > 500) cache.clear();
  cache.set(src, node);
  return node;
}

/** Validate syntax. Returns an error message or null. */
export function checkFormula(src: string): string | null {
  try {
    compileFormula(src);
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : 'Invalid formula';
  }
}

export function evaluateFormula(src: string, env: FormulaEnv): { value: FormulaValue; error?: string } {
  if (!src.trim()) return { value: null };
  try {
    const v = evaluate(compileFormula(src), env);
    if (typeof v === 'number' && !Number.isFinite(v)) return { value: null, error: 'Result is not a finite number' };
    return { value: v };
  } catch (e) {
    return { value: null, error: e instanceof Error ? e.message : 'Formula error' };
  }
}
