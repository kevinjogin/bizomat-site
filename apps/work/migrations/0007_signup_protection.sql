-- Sign-up protection (owner's request, 12 Nov 2026): confirmed email addresses. Additive only: one new column and one
-- new table; nothing is dropped or rewritten.

-- When the person proved they receive mail at their address (the confirmation link, Google's verified address, or an
-- invitation sent to it). NULL: not confirmed yet.
ALTER TABLE users ADD COLUMN email_verified_at INTEGER;

-- Everyone who already has an account keeps signing in exactly as before.
UPDATE users SET email_verified_at = created_at WHERE email_verified_at IS NULL;

-- Confirmation links: only the SHA-256 of the token is stored; single use; 24 hours.
CREATE TABLE email_verifications (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL COLLATE NOCASE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER
);
CREATE INDEX idx_email_verifications_user ON email_verifications(user_id, created_at);
