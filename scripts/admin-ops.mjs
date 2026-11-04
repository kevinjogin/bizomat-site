#!/usr/bin/env node
// Privileged operations run from GitHub Actions (see .github/workflows/admin-ops.yml).
// Never prints password hashes, tokens or other users' personal data.
import { execFileSync } from 'node:child_process';

const op = process.env.OP;
const env = process.env.TARGET_ENV;
const email = (process.env.ACCOUNT_EMAIL || '').trim().toLowerCase();
const token = process.env.CLOUDFLARE_API_TOKEN;
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
if (!['preview', 'production'].includes(env)) throw new Error('bad environment');
if (!token || !account) throw new Error('Cloudflare secrets missing');
const EMAIL_RE = /^[^\s@'"\\;]+@[^\s@'"\\;]+\.[^\s@'"\\;]+$/;

function d1(sql) {
  const out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'DB', '--remote', '--env', env, '--json', '--command', sql], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
  const parsed = JSON.parse(out);
  return parsed[0]?.results ?? [];
}

async function cf(path) {
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok && j.success !== false, result: j.result, errors: j.errors };
}

const worker = `workos-platform-${env}`;

if (op === 'audit') {
  console.log(`== Audit of ${worker}`);
  const domains = await cf('/workers/domains');
  if (domains.ok) {
    const mine = (domains.result ?? []).filter((d) => d.service === worker);
    console.log(`Custom domains attached to ${worker}: ${mine.map((d) => d.hostname).join(', ') || '(none)'}`);
    const others = (domains.result ?? []).filter((d) => d.hostname === 'work.kevos.com' && d.service !== worker);
    if (others.length) console.log(`work.kevos.com is attached to a DIFFERENT Worker: ${others.map((d) => d.service).join(', ')}`);
  } else console.log(`Could not list custom domains (token scope): ${JSON.stringify(domains.errors)}`);
  const sub = await cf('/workers/subdomain');
  console.log(`workers.dev subdomain: ${sub.result?.subdomain ?? '?'}`);
  for (const url of ['https://work.kevos.com/api/health', `https://${worker}.${sub.result?.subdomain}.workers.dev/api/health`]) {
    try {
      const r = await fetch(url, { redirect: 'manual' });
      const body = await r.text();
      console.log(`GET ${url} -> ${r.status} ${body.slice(0, 200)}`);
    } catch (e) {
      console.log(`GET ${url} -> failed: ${e.message}`);
    }
  }
  const tables = d1("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name").map((r) => r.name);
  console.log(`Tables: ${tables.join(', ')}`);
  const migs = tables.includes('d1_migrations') ? d1('SELECT name FROM d1_migrations ORDER BY id').map((r) => r.name) : [];
  console.log(`Applied migrations: ${migs.join(', ') || '(none)'}`);
  const counts = d1(`SELECT
    (SELECT COUNT(*) FROM users) AS users,
    (SELECT COUNT(*) FROM workspaces WHERE deleted_at IS NULL) AS workspaces,
    (SELECT COUNT(*) FROM boards WHERE kind != 'template') AS boards,
    (SELECT COUNT(*) FROM items) AS items,
    (SELECT COUNT(*) FROM sessions) AS sessions,
    (SELECT COUNT(*) FROM sessions WHERE revoked_at IS NULL AND expires_at > strftime('%s','now') * 1000) AS live_sessions,
    (SELECT MIN(created_at) FROM users) AS first_user_at,
    (SELECT MAX(created_at) FROM users) AS last_user_at`)[0];
  console.log(`Counts: ${JSON.stringify({ ...counts, first_user_at: counts.first_user_at && new Date(counts.first_user_at).toISOString(), last_user_at: counts.last_user_at && new Date(counts.last_user_at).toISOString() })}`);
  if (email && EMAIL_RE.test(email)) {
    const me = d1(`SELECT id, created_at, (password_hash IS NOT NULL) AS has_password FROM users WHERE email = '${email}'`);
    if (me.length) console.log(`Founder account ${email}: exists, id ${me[0].id}, registered ${new Date(me[0].created_at).toISOString()}, password login ${me[0].has_password ? 'yes' : 'no'}`);
    else console.log(`Founder account ${email}: NOT registered yet`);
    if (tables.includes('platform_admins')) {
      const admins = d1('SELECT COUNT(*) AS n FROM platform_admins')[0];
      const isAdmin = d1(`SELECT p.role FROM platform_admins p JOIN users u ON u.id = p.user_id WHERE u.email = '${email}'`);
      console.log(`Platform admins: ${admins.n}; ${email} role: ${isAdmin[0]?.role ?? 'none'}`);
    }
  }
} else if (op === 'backup') {
  const file = `backup-${env}-${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;
  execFileSync('npx', ['wrangler', 'd1', 'export', `workos-platform-${env}-db`, '--remote', '--env', env, '--output', file], { stdio: 'inherit' });
  console.log(`Backup written to ${file} (uploaded as a workflow artifact)`);
} else if (op === 'grant-founder' || op === 'revoke-admin') {
  if (!EMAIL_RE.test(email)) throw new Error('A valid email is required');
  const user = d1(`SELECT id, created_at FROM users WHERE email = '${email}'`)[0];
  if (!user) throw new Error(`No account with ${email}. Register it in the app first, then re-run.`);
  const now = Date.now();
  if (op === 'grant-founder') {
    d1(`INSERT INTO platform_admins (user_id, role, granted_by, granted_at, note) VALUES ('${user.id}', 'founder', 'github-actions', ${now}, 'Granted via admin-ops workflow')
        ON CONFLICT(user_id) DO UPDATE SET role = 'founder', granted_by = 'github-actions', granted_at = ${now}`);
    d1(`INSERT INTO audit_log (id, workspace_id, actor_id, action, target_type, target_id, metadata_json, created_at) VALUES ('ops-${now}', NULL, NULL, 'platform_admin.granted', 'user', '${user.id}', '{"via":"github-actions","role":"founder"}', ${now})`);
    console.log(`Granted founder admin to ${email} (account registered ${new Date(user.created_at).toISOString()}).`);
  } else {
    d1(`DELETE FROM platform_admins WHERE user_id = '${user.id}'`);
    d1(`INSERT INTO audit_log (id, workspace_id, actor_id, action, target_type, target_id, metadata_json, created_at) VALUES ('ops-${now}', NULL, NULL, 'platform_admin.revoked', 'user', '${user.id}', '{"via":"github-actions"}', ${now})`);
    console.log(`Revoked platform admin from ${email}.`);
  }
} else throw new Error(`Unknown operation ${op}`);
