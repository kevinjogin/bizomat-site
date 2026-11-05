-- Security remediation (5 Nov 2026). A password someone else chose (the founder's reset) or a security reset must be
-- replaced before the account can be used: while this is 1, every API call except changing the password and signing
-- out answers 403 with details.code PASSWORD_RESET_REQUIRED, and live board updates are refused. Changing the
-- password clears it.
ALTER TABLE users ADD COLUMN password_reset_required INTEGER NOT NULL DEFAULT 0;
