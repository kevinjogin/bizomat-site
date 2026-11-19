// Migration 0030 (Stage 1, R3): the one rebuild window keeps every company, member, invitation and department
// membership, with foreign keys on for the connection, and the registry gets one row per company of every kind.
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';
import { applyMigrations, needsForeignKeysOff, readMigrationsDir } from '../src/node/store/migrations.ts';

const all = readMigrationsDir('migrations');
const before = all.filter((m) => m.name < '0030');

function seeded(): DatabaseSync {
  const db = new DatabaseSync(':memory:', { enableForeignKeyConstraints: true, enableDoubleQuotedStringLiterals: true });
  applyMigrations(db, before);
  db.exec(`
    INSERT INTO users (id, email, name, created_at, updated_at, email_verified_at) VALUES
      ('u1','owner@example.com','Owner',1,1,5), ('u2','member@example.com','Member',1,1,NULL), ('u3','solo@example.com','Solo',1,1,7);
    INSERT INTO co_companies (id, name, kind, legal_name, country, abn, acn, abn_status, abr_checked_at, email, phone, phone_kind, address_line1, suburb, state, postcode, created_by, created_at, updated_at)
      VALUES ('c1','Acme','business','Acme Pty Ltd','AU','12345678901',NULL,'active',40,'office@example.com','0400000000','mobile','1 Example St','Sydney','NSW','2000','u1',10,20),
             ('c2','Two','business','','AU',NULL,'123456780','none',NULL,'two@example.com','0400000001','mobile','2 Example St','Perth','WA','6000','u2',11,21),
             ('c3','Gone','business','','AU','12345678902',NULL,'cancelled',50,'gone@example.com','0400000002','mobile','3 Example St','Hobart','TAS','7000','u1',12,22);
    INSERT INTO co_members (company_id, user_id, role, joined_at) VALUES ('c1','u1','owner',1), ('c1','u2','member',2), ('c2','u2','owner',3);
    INSERT INTO co_invitations (id, company_id, email, role, token_hash, invited_by, created_at, expires_at) VALUES ('i1','c1','new@example.com','member','h1','u1',1,9);
    INSERT INTO co_departments (id, company_id, name, created_at, updated_at) VALUES ('d1','c1','Ops',1,1);
    INSERT INTO co_department_members (company_id, department_id, user_id, added_at) VALUES ('c1','d1','u2',1);
    INSERT INTO co_audit (id, company_id, action, created_at) VALUES ('a1','c1','company.created',1);
    INSERT INTO sys_companies (id, owner_id, name, created_via, created_at, updated_at) VALUES ('p3','u3','Solo','visit',30,31);
    INSERT INTO sys_demo (user_id, company_id, name, status, created_at, updated_at, removed_at) VALUES ('u1','e1','Acme Studio (example)','ready',40,41,NULL), ('u3','e3','Acme Studio (example)','removed',42,43,44);
  `);
  return db;
}

const count = (db: DatabaseSync, sql: string) => Number((db.prepare(sql).get() as { n: number }).n);

describe('migration 0030: one company identity', () => {
  it('is marked to run with foreign keys off, and its reverse too', () => {
    expect(needsForeignKeysOff(all.find((m) => m.name === '0030_company_identity.sql')!.sql)).toBe(true);
    expect(needsForeignKeysOff(readFileSync('migrations-reverse/0030_company_identity.sql', 'utf8'))).toBe(true);
  });

  it('keeps every row of the rebuilt tables and of their children, and turns foreign keys back on', () => {
    const db = seeded();
    applyMigrations(db, all);
    expect((db.prepare('PRAGMA foreign_keys').get() as { foreign_keys: number }).foreign_keys).toBe(1);
    expect(db.prepare('PRAGMA foreign_key_check').all()).toEqual([]);
    expect(count(db, 'SELECT COUNT(*) AS n FROM co_companies')).toBe(3);
    expect(count(db, 'SELECT COUNT(*) AS n FROM co_members')).toBe(3);
    expect(count(db, 'SELECT COUNT(*) AS n FROM co_invitations')).toBe(1);
    expect(count(db, 'SELECT COUNT(*) AS n FROM co_department_members')).toBe(1);
    expect(count(db, 'SELECT COUNT(*) AS n FROM co_audit')).toBe(1);
    expect(db.prepare("SELECT name, abn, abn_status, state, trading_name FROM co_companies WHERE id = 'c1'").get()).toEqual({ name: 'Acme', abn: '12345678901', abn_status: 'active', state: 'NSW', trading_name: '' });
    // Indexes are back: one owner per company, one company per ABN.
    expect(() => db.exec("INSERT INTO co_members (company_id, user_id, role, joined_at) VALUES ('c1','u3','owner',9)")).toThrow();
    expect(() =>
      db.exec("INSERT INTO co_companies (id, name, kind, abn, email, phone, phone_kind, address_line1, suburb, state, postcode, created_at, updated_at) VALUES ('c9','X','business','12345678901','x@example.com','1','mobile','1','S','NSW','2000',1,1)"),
    ).toThrow();
    // Deleting a company still cascades to its people (foreign keys survived the rebuild).
    db.exec("DELETE FROM co_companies WHERE id = 'c2'");
    expect(count(db, "SELECT COUNT(*) AS n FROM co_members WHERE company_id = 'c2'")).toBe(0);
  });

  it('accepts companies outside Australia and the Stage 1 roles, and keeps the Australian rules', () => {
    const db = seeded();
    applyMigrations(db, all);
    db.exec("INSERT INTO co_companies (id, name, kind, country, email, phone, phone_kind, address_line1, suburb, state, postcode, created_at, updated_at) VALUES ('g1','UK Co','business','GB','uk@example.com','+44 20 0000 0000','international','1 Road','London','','SW1A 1AA',1,1)");
    expect(() => db.exec("INSERT INTO co_companies (id, name, kind, country, email, phone, phone_kind, address_line1, suburb, state, postcode, created_at, updated_at) VALUES ('a9','Bad','business','AU','b@example.com','1','mobile','1','S','XX','2000',1,1)")).toThrow();
    expect(() => db.exec("INSERT INTO co_companies (id, name, kind, country, email, phone, phone_kind, address_line1, suburb, state, postcode, created_at, updated_at) VALUES ('a8','Bad','business','au','b@example.com','1','mobile','1','S','NSW','2000',1,1)")).toThrow();
    db.exec("INSERT INTO co_members (company_id, user_id, role, joined_at) VALUES ('c1','u3','read_only',9)");
    db.exec("UPDATE co_members SET role = 'employee' WHERE company_id = 'c1' AND user_id = 'u2'");
    expect(() => db.exec("UPDATE co_members SET role = 'boss' WHERE company_id = 'c1' AND user_id = 'u2'")).toThrow();
  });

  it('gives every company one registry row with its own id, claiming no more than the checks found', () => {
    const db = seeded();
    applyMigrations(db, all);
    const rows = db.prepare('SELECT id, type, name, owner_id, country, registration_type, registration_number, registration_status, status_source, deleted_at FROM companies ORDER BY id').all();
    expect(rows).toEqual([
      { id: 'c1', type: 'registered', name: 'Acme', owner_id: 'u1', country: 'AU', registration_type: 'ABN', registration_number: '12345678901', registration_status: 'registration_pending', status_source: 'migration', deleted_at: null },
      { id: 'c2', type: 'registered', name: 'Two', owner_id: 'u2', country: 'AU', registration_type: 'ACN', registration_number: '123456780', registration_status: 'not_registered', status_source: 'none', deleted_at: null },
      { id: 'c3', type: 'registered', name: 'Gone', owner_id: null, country: 'AU', registration_type: 'ABN', registration_number: '12345678902', registration_status: 'deregistered', status_source: 'migration', deleted_at: null },
      { id: 'e1', type: 'example', name: 'Acme Studio (example)', owner_id: 'u1', country: null, registration_type: null, registration_number: null, registration_status: 'not_registered', status_source: 'none', deleted_at: null },
      { id: 'e3', type: 'example', name: 'Acme Studio (example)', owner_id: 'u3', country: null, registration_type: null, registration_number: null, registration_status: 'not_registered', status_source: 'none', deleted_at: 44 },
      { id: 'p3', type: 'personal', name: 'Solo', owner_id: 'u3', country: null, registration_type: null, registration_number: null, registration_status: 'not_registered', status_source: 'none', deleted_at: null },
    ]);
    expect(count(db, "SELECT COUNT(*) AS n FROM companies WHERE registration_status = 'verified'")).toBe(0);
    expect(db.prepare('SELECT legacy_table, COUNT(*) AS n FROM legacy_company_id_map GROUP BY legacy_table ORDER BY legacy_table').all()).toEqual([
      { legacy_table: 'co_companies', n: 3 },
      { legacy_table: 'sys_companies', n: 1 },
      { legacy_table: 'sys_demo', n: 2 },
    ]);
    // One legal entity per country, registration type and number.
    expect(() =>
      db.exec("INSERT INTO companies (id, type, name, country, registration_type, registration_number, created_at, updated_at) VALUES ('x','registered','Copy','AU','ABN','12345678901',1,1)"),
    ).toThrow();
    // Emails proven before: legacy. Unproven: none.
    expect(db.prepare('SELECT id, email_verified_via FROM users ORDER BY id').all()).toEqual([
      { id: 'u1', email_verified_via: 'legacy' },
      { id: 'u2', email_verified_via: null },
      { id: 'u3', email_verified_via: 'legacy' },
    ]);
  });

  it('does not commit when a rebuild would leave a broken reference', () => {
    const db = seeded();
    // A member of a company that does not exist (possible only with foreign keys off, as an old copy could have).
    db.exec('PRAGMA foreign_keys = OFF');
    db.exec("INSERT INTO co_members (company_id, user_id, role, joined_at) VALUES ('nope','u3','member',1)");
    db.exec('PRAGMA foreign_keys = ON');
    expect(() => applyMigrations(db, all)).toThrow(/0030_company_identity.sql failed: 1 rows would break a foreign key \(co_members\)/);
    expect(count(db, "SELECT COUNT(*) AS n FROM sqlite_master WHERE name = 'companies'")).toBe(0);
    expect(count(db, "SELECT COUNT(*) AS n FROM d1_migrations WHERE name = '0030_company_identity.sql'")).toBe(0);
    expect((db.prepare('PRAGMA foreign_keys').get() as { foreign_keys: number }).foreign_keys).toBe(1);
  });

  it('the reverse script takes it back out and keeps every row', () => {
    const db = seeded();
    applyMigrations(db, all.filter((m) => m.name < '0031'));
    const schemaBefore = new DatabaseSync(':memory:', { enableForeignKeyConstraints: true, enableDoubleQuotedStringLiterals: true });
    applyMigrations(schemaBefore, before);
    db.exec('PRAGMA foreign_keys = OFF');
    db.exec(readFileSync('migrations-reverse/0030_company_identity.sql', 'utf8'));
    db.exec('PRAGMA foreign_keys = ON');
    expect(db.prepare('PRAGMA foreign_key_check').all()).toEqual([]);
    expect(count(db, 'SELECT COUNT(*) AS n FROM co_members')).toBe(3);
    expect(count(db, 'SELECT COUNT(*) AS n FROM co_department_members')).toBe(1);
    const shape = (d: DatabaseSync) =>
      (d.prepare("SELECT name, sql FROM sqlite_master WHERE name IN ('co_companies','co_members','co_invitations','users') OR tbl_name IN ('co_companies','co_members','co_invitations') ORDER BY name").all() as { name: string; sql: string | null }[]).map((r) => [
        r.name,
        (r.sql ?? '').replace(/"/g, '').replace(/_old\b/g, '').replace(/\s+/g, ' '),
      ]);
    expect(shape(db).map(([n]) => n)).toEqual(shape(schemaBefore).map(([n]) => n));
    expect(count(db, "SELECT COUNT(*) AS n FROM sqlite_master WHERE name IN ('companies','company_settings','legacy_company_id_map')")).toBe(0);
    // And 0030 applies again on top.
    applyMigrations(db, all.filter((m) => m.name < '0031'));
    expect(count(db, 'SELECT COUNT(*) AS n FROM companies')).toBe(6);
  });
});
