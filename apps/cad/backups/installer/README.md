# Installer backups

- `original/<date>/`: installers exactly as they were released, before signing. Never changed.
- `development-signed/<version>-<date and time>/`: installers signed with the BIZOMAT development certificate by
  `installer/sign-development.ps1 -Backup`, with their checksums, signing report and the public certificate.

Rules: one new dated folder per backup; never overwrite or delete a folder; no private keys, `.pfx` files,
passwords or tokens (`tests/test_installer.py` checks). Each folder has a MANIFEST.md or a signing report saying what
the files are and where they came from.
