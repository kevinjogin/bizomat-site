-- One system (owner, 14 Nov 2026: "move all users to this SYSTEM"): every existing active account gets its company of
-- its own in BIZOMAT System now, instead of on its first visit or at a later maintenance run. Additive: rows in
-- sys_companies only, the same rows src/worker/system/system.ts (ensureOwnCompany) makes: an id, the owner, a name (the
-- person's name, else the part of their email before the @) and dates. No invented details; tools are not copied (the
-- System works out each tool's company when asked). Accounts made later get theirs on first visit, as before.
INSERT OR IGNORE INTO sys_companies (id, owner_id, name, created_via, created_at, updated_at)
SELECT lower(hex(randomblob(12))),
       u.id,
       COALESCE(NULLIF(substr(trim(u.name), 1, 100), ''), NULLIF(substr(u.email, 1, instr(u.email, '@') - 1), ''), 'My company'),
       'migration',
       CAST(strftime('%s', 'now') AS INTEGER) * 1000,
       CAST(strftime('%s', 'now') AS INTEGER) * 1000
  FROM users u
 WHERE u.disabled_at IS NULL
   AND NOT EXISTS (SELECT 1 FROM sys_companies s WHERE s.owner_id = u.id);
