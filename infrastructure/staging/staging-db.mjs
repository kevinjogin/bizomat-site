#!/usr/bin/env node
// Runs ON a bizomat-staging work Machine (sent there by .github/workflows/bizomat-staging.yml (action verify) with flyctl, as the
// work user): the few changes a verification run makes to staging's own database. Never on production: it refuses a
// Machine whose FLY_APP_NAME does not end in -staging (the workflow sets it for the exec), and a database that is not
// /data/work/db.sqlite.
//
//   node staging-db.mjs prepare     staging's sign-up policy accepts invented example.com addresses (email goes to the log)
//   node staging-db.mjs flags-on    new_ui_enabled, company_members_v2, cad_in_erp and company_admin_console on for everyone in staging
//   node staging-db.mjs flags-off   both off again (the global rows removed)
//
// Prints one JSON line with what is set now; never prints anyone's data.
import { DatabaseSync } from 'node:sqlite';

const mode = process.argv[2];
const app = process.env.FLY_APP_NAME ?? '';
const file = process.argv[3] ?? '/data/work/db.sqlite';
if (!/-staging$/.test(app) && process.env.STAGING_DB_LOCAL !== '1') throw new Error(`refused: not a staging Machine (${app || 'no FLY_APP_NAME'})`);
if (file !== '/data/work/db.sqlite' && process.env.STAGING_DB_LOCAL !== '1') throw new Error('refused: not the work database');
const FLAGS = ['new_ui_enabled', 'company_members_v2', 'cad_in_erp', 'company_admin_console'];
const db = new DatabaseSync(file);
db.exec('PRAGMA busy_timeout = 5000');
const t = Date.now();

if (mode === 'prepare') {
  const row = db.prepare("SELECT value FROM system_kv WHERE key = 'signup_protection'").get();
  const p = row ? JSON.parse(row.value) : {};
  const allowed = Array.isArray(p.allowedDomains) ? p.allowedDomains : [];
  if (!allowed.includes('example.com')) allowed.push('example.com');
  const next = { ...p, allowedDomains: allowed, updatedAt: t, updatedBy: 'staging-verify' };
  db.prepare("INSERT INTO system_kv (key, value, updated_at) VALUES ('signup_protection', ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at").run(JSON.stringify(next), t);
} else if (mode === 'flags-on') {
  const put = db.prepare("INSERT OR REPLACE INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES (?, 'global', '', 'on', 'staging verification run', 'staging-verify', ?)");
  for (const k of FLAGS) put.run(k, t);
} else if (mode === 'flags-off') {
  const del = db.prepare("DELETE FROM feature_flags WHERE key = ? AND scope = 'global' AND scope_id = ''");
  for (const k of FLAGS) del.run(k);
} else throw new Error('mode: prepare, flags-on or flags-off');

const flags = Object.fromEntries(FLAGS.map((k) => [k, db.prepare("SELECT value FROM feature_flags WHERE key = ? AND scope = 'global' AND scope_id = ''").get(k)?.value ?? 'off']));
const policy = JSON.parse(db.prepare("SELECT value FROM system_kv WHERE key = 'signup_protection'").get()?.value ?? '{}');
console.log(`staging-db ${JSON.stringify({ mode, flags, exampleAllowed: (policy.allowedDomains ?? []).includes('example.com') })}`);
db.close();
