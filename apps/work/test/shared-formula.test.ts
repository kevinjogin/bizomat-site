import { describe, expect, it } from 'vitest';
import { checkFormula, evaluateFormula } from '../src/shared/formula';

const env = (vals: Record<string, any>) => ({
  resolve: (t: string) => {
    if (!(t in vals)) throw new Error(`Unknown column {${t}}`);
    return vals[t];
  },
  today: '2026-01-10',
});

describe('formula engine', () => {
  it('evaluates arithmetic with precedence and parentheses', () => {
    expect(evaluateFormula('1 + 2 * 3', env({})).value).toBe(7);
    expect(evaluateFormula('(1 + 2) * 3', env({})).value).toBe(9);
    expect(evaluateFormula('2 ^ 3 ^ 2', env({})).value).toBe(512);
    expect(evaluateFormula('-4 + 10', env({})).value).toBe(6);
    expect(evaluateFormula('10 % 4', env({})).value).toBe(2);
  });

  it('resolves column references', () => {
    expect(evaluateFormula('{Deal value} * {Probability} / 100', env({ 'Deal value': 1000, Probability: 25 })).value).toBe(250);
  });

  it('supports functions', () => {
    const e = env({ a: 3, b: 4, s: 'hi' });
    expect(evaluateFormula('SUM({a}, {b}, 3)', e).value).toBe(10);
    expect(evaluateFormula('AVG({a}, {b})', e).value).toBe(3.5);
    expect(evaluateFormula('MIN(5, {a})', e).value).toBe(3);
    expect(evaluateFormula('MAX(5, {b})', e).value).toBe(5);
    expect(evaluateFormula('ROUND(2.345, 2)', e).value).toBe(2.35);
    expect(evaluateFormula('IF({a} > 2, "big", "small")', e).value).toBe('big');
    expect(evaluateFormula('CONCAT({s}, " ", "there")', e).value).toBe('hi there');
    expect(evaluateFormula('{s} & "!"', e).value).toBe('hi!');
    expect(evaluateFormula('UPPER({s})', e).value).toBe('HI');
    expect(evaluateFormula('LEN("abcd")', e).value).toBe(4);
    expect(evaluateFormula('AND(TRUE, {a} = 3)', e).value).toBe(true);
    expect(evaluateFormula('NOT(OR(FALSE, FALSE))', e).value).toBe(true);
    expect(evaluateFormula('TODAY()', e).value).toBe('2026-01-10');
    expect(evaluateFormula('DAYS("2026-01-20", "2026-01-10")', e).value).toBe(10);
    expect(evaluateFormula('ADD_DAYS("2026-01-30", 3)', e).value).toBe('2026-02-02');
    expect(evaluateFormula('COALESCE("", "x")', e).value).toBe('x');
  });

  it('division by zero yields null', () => {
    expect(evaluateFormula('1 / 0', env({})).value).toBeNull();
  });

  it('reports syntax errors without throwing', () => {
    expect(checkFormula('1 +')).toBeTruthy();
    expect(checkFormula('{unterminated')).toBeTruthy();
    expect(checkFormula('NOPE(1)')).toBeNull(); // unknown function is a runtime error
    expect(evaluateFormula('NOPE(1)', env({})).error).toMatch(/Unknown function/);
    expect(evaluateFormula('{missing}', env({})).error).toMatch(/Unknown column/);
    expect(checkFormula('"a" + `b`')).toBeTruthy();
  });

  it('cannot execute code (no eval)', () => {
    const r = evaluateFormula('constructor.constructor("return 1")()', env({}));
    expect(r.value).toBeNull();
    expect(r.error).toBeTruthy();
  });

  it('rejects overly long / deeply nested formulas', () => {
    expect(checkFormula('1+'.repeat(1500) + '1')).toMatch(/too long/);
    expect(checkFormula('('.repeat(100) + '1' + ')'.repeat(100))).toMatch(/nested/);
  });
});
