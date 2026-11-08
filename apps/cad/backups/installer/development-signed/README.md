# Development-signed installers

Made on the Windows development computer with:

    powershell -ExecutionPolicy Bypass -File installer\sign-development.ps1 -Build -Backup

Each run that is backed up adds a folder `<version>-<yyyyMMdd-HHmm>` here with the signed MSI, its `.sha256`, the
release record, `signing-report.txt` and `.json`, and `BIZOMAT-Development.cer` (the public certificate only). The
script refuses to write into a folder that already exists.

These installers are signed with a self-signed development certificate. Windows on other computers does not trust it:
it shows an unknown or untrusted publisher, and the Companion's updater refuses such an MSI. Use them for testing
only. See `docs/BIZOMAT-DEV-SIGNING.md`.
