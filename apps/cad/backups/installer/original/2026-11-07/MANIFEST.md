# Original installer backup, 7 Nov 2026

The installer as CI built and released it, before any development signing. Kept unchanged. Never replace or delete
these files; a later backup goes in a new dated folder.

| Item | Value |
|---|---|
| File | `BIZOMAT-CAD-Automation-0.13.0-x64-UNSIGNED.msi` |
| Size | 1290240 bytes |
| SHA-256 | `e8517f9c6f351cc0636809f8d06ab9b93c485071dc19129049331425b06251b8` |
| Version | 0.13.0 (`solidworks/Directory.Build.props`) |
| Built from | commit `2919c7f` ("SOLIDWORKS add-in 0.13.0", #22), job `installer` in `.github/workflows/solidworks.yml` |
| Signed | No. CI had no signing certificate; the MSI has no `DigitalSignature` stream, and the name says UNSIGNED |
| Where it came from | GitHub release `bridge-latest` (pre-release, private), asset id 717303288, published 2026-11-06T13:41:38Z |
| Download URL | `https://github.com/jogkev-creator/CADOS/releases/download/bridge-latest/BIZOMAT-CAD-Automation-0.13.0-x64-UNSIGNED.msi` (private) |
| Retrieved | 2026-11-07, through the GitHub API (`/repos/jogkev-creator/CADOS/releases/assets/717303288`) |
| Same file | `BIZOMAT-CAD-Automation-x64.msi` and `CADOS-for-SOLIDWORKS-x64.msi` in the same release (same SHA-256, not copied again) |

Checks made when it was retrieved:

- SHA-256 equals GitHub's own digest for the asset (`sha256:e8517f9c...51b8`) and the released `.sha256` file
  (kept here as released: `sha256sum -c BIZOMAT-CAD-Automation-0.13.0-x64-UNSIGNED.msi.sha256`).
- `release.json` is the release record from the same release, kept as released. Its `msi_url` names
  `bridge-v0.13.0`, a release that does not exist; the file itself is in `bridge-latest`.

Why it is kept here: CI deletes and remakes the `bridge-latest` release on every main build of `solidworks/` or
`installer/`, so the release asset would be gone after the next build.

What the Fly.io server serves: nothing of its own. `https://cados.fly.dev/download/solidworks` answers 301 to
`https://bizomat.ai/cad/download/solidworks`, which asks for sign-in and then redirects (302) to
`OPENSKETCH_INSTALLER_URL`, else the `msi_url` of `bridge-release.json` in the server's data folder, else
`https://bizomat.ai/downloads/cad/BIZOMAT-CAD-Automation-x64.msi` (`opensketch/server.py`, `installer_url`). On
7 Nov 2026 that last address answered 404, as the installer had not yet been published to bizomat.ai.
