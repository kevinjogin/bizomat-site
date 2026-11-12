-- Group descriptions (owner's request, 12 Nov 2026): a board's groups (its categories) can carry a plain-text
-- description. Additive only: one new column with a default; nothing is dropped or rewritten, and the previous Worker
-- version keeps working on this schema (it never reads or writes the column).

-- Plain text, up to 5,000 characters (checked by the API). Paragraphs are separated by blank lines; a line starting
-- with "- " or "* " is a bullet. Empty: no description.
ALTER TABLE groups ADD COLUMN description TEXT NOT NULL DEFAULT '';
