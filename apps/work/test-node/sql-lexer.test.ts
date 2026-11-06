import { describe, expect, it } from 'vitest';
import { analyzeSql } from '../src/node/bindings/sql-lexer.ts';

const stmts = (sql: string) => analyzeSql(sql).statements;

describe('sql lexer', () => {
  it('counts parameters with SQLite numbering rules', () => {
    expect(stmts('SELECT ?')[0].paramCount).toBe(1);
    expect(stmts('SELECT ?, ?, ?')[0].paramCount).toBe(3);
    expect(stmts('SELECT ?3')[0].paramCount).toBe(3);
    expect(stmts('SELECT ?1, ?2, ?1')[0].paramCount).toBe(2);
    expect(stmts('SELECT ?2, ?')[0].paramCount).toBe(3);
    expect(stmts('SELECT :a, :b, :a')[0].paramCount).toBe(2);
    expect(stmts('SELECT @x, $y, ?')[0].paramCount).toBe(3);
    expect(stmts('SELECT 1')[0].paramCount).toBe(0);
  });

  it('rewrites named parameters to the index SQLite gives them', () => {
    expect(stmts("SELECT :a, ?, :b, :a, ':c'")[0].text).toBe("SELECT ?1, ?, ?3, ?1, ':c'");
    expect(stmts('SELECT @x, $y')[0].text).toBe('SELECT ?1, ?2');
  });

  it('ignores ? and ; inside strings, identifiers and comments', () => {
    const s = stmts(`SELECT '?;', "a?b;", \`c;?\`, [d;?] -- ? ;\n /* ; ? */ FROM t WHERE x = ?`);
    expect(s).toHaveLength(1);
    expect(s[0].paramCount).toBe(1);
    expect(stmts("SELECT 'it''s; ?' AS x")[0].paramCount).toBe(0);
  });

  it('splits statements and keeps trigger bodies whole', () => {
    expect(stmts('SELECT 1; SELECT 2;').map((s) => s.text)).toEqual(['SELECT 1', 'SELECT 2']);
    const t = stmts('CREATE TRIGGER t AFTER INSERT ON a BEGIN UPDATE a SET x = CASE WHEN y THEN 1 ELSE 2 END; INSERT INTO b VALUES (1); END; SELECT 3');
    expect(t).toHaveLength(2);
    expect(t[0].text).toMatch(/END$/);
    expect(t[1].text).toBe('SELECT 3');
    expect(stmts('CREATE TEMP TRIGGER t AFTER INSERT ON a BEGIN SELECT 1; END')).toHaveLength(1);
  });

  it('reports empty statements, keywords and pragma names', () => {
    expect(analyzeSql('SELECT 1;;').emptyStatement).toBe(true);
    expect(analyzeSql('SELECT 1;').emptyStatement).toBe(false);
    expect(analyzeSql('-- only a comment').statements).toHaveLength(0);
    expect(stmts('  with c as (select 1) select * from c')[0].keyword).toBe('WITH');
    expect(stmts('PRAGMA foreign_keys = OFF')[0].pragma).toBe('foreign_keys');
    expect(stmts('PRAGMA main.table_info(users)')[0].pragma).toBe('table_info');
    expect(stmts('pragma "journal_mode"')[0].pragma).toBe('journal_mode');
    expect(stmts("SELECT x'0102', 1.5e-3, .5")[0].paramCount).toBe(0);
  });
});
