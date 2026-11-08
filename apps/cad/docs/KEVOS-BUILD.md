# Building and releasing KEVOS Bridge

## Parts

| Part | Source | Built with |
|---|---|---|
| KEVOS gateway (MCP server, device API) | `opensketch/` (`devicebridge.py` for devices) | Python 3.12, `requirements.txt` (hash-pinned) |
| KEVOS add-in (`OpenSketch.Sw.dll`) | `solidworks/src/Addin`, `solidworks/src/Core` | .NET 8 SDK, target .NET Framework 4.8 x64, SOLIDWORKS 2022 interop embedded |
| KEVOS Companion (`KEVOS.Companion.exe`) | `solidworks/src/Companion`, `solidworks/src/Core` | .NET 8 SDK, target .NET Framework 4.8 x64 (no SOLIDWORKS reference) |
| Protocol core (shared) | `solidworks/src/Core/Bridge2` | compiled into both, and into the .NET 8 tests |
| Installer | `installer/KEVOS-Bridge.wxs`, `installer/build.ps1` | WiX Toolset 5 (Windows only) |

## Build and test (Linux or Windows)

```bash
pip install --require-hashes -r requirements-dev.txt && pip install --no-deps -e .
```

```bash
pytest -q
```

```bash
npm test
```

```bash
bash solidworks/build.sh test
```

`pytest -q` includes the KEVOS end-to-end test (`tests/test_bridge_e2e.py`, marked slow) when the .NET SDK is
installed: it builds `solidworks/tests/BridgeProbe` and runs the real C# Companion engine and add-in link against the
real server. `solidworks/build.sh` puts the add-in, Companion, legacy installer, macro and README in
`solidworks/dist/OpenSketch-SOLIDWORKS`.

## The MSI (Windows)

```bash
powershell -ExecutionPolicy Bypass -File installer\build.ps1
```

It reads the version from `solidworks/Directory.Build.props`, writes the licence files, signs the binaries and the MSI
when `KEVOS_SIGN_PFX` and `KEVOS_SIGN_PASSWORD` are set (SHA-256, RFC 3161 timestamp), and writes to `installer/out`:
`BIZOMAT-CAD-Automation-<version>-x64.msi` (or `-UNSIGNED.msi`), the same file as `BIZOMAT-CAD-Automation-x64.msi` (the
stable name the website links to), their `.sha256`, and `release.json`. See also [CADOS-ADDIN.md](CADOS-ADDIN.md).

## CI

- `.github/workflows/tests.yml`: pytest (fast and slow jobs; the slow job has .NET for the end-to-end test) and
  npm test, on pull requests and non-main pushes.
- `.github/workflows/solidworks.yml`: builds and tests the add-in and Companion on Linux, then builds the MSI on
  Windows. Secrets `KEVOS_SIGN_PFX_BASE64` and `KEVOS_SIGN_PASSWORD` make it signed. Artifact `BIZOMAT-CAD-Automation-MSI` on
  every run; release `bridge-latest` (prerelease) on main; release `bridge-v<version>` on a tag of that name.
- `.github/workflows/deploy.yml`: the gateway (unchanged).

## Releasing a version

1. Bump `<Version>` in `solidworks/Directory.Build.props` (the add-in, Companion and MSI share it; MSI upgrades need a
   higher version).
2. Update `docs/KEVOS-RELEASE-NOTES.md`. Merge to main.
3. Tag `bridge-v<version>` and push the tag. CI builds, signs and publishes the release.
4. Check the MSI on a clean Windows VM (the checklist in the test report), then publish it to computers: copy
   `release.json` to the gateway's data folder as `bridge-release.json` (its `msi_url` points at the release
   asset). Companions see it at their next check, verify it and ask the person before installing.

## Signing

See [KEVOS-SIGNING.md](KEVOS-SIGNING.md) for the options (SignPath Foundation, Azure Artifact Signing, a commercial
certificate with cloud signing). Certificates are no longer issued as exportable `.pfx` files, so the `KEVOS_SIGN_PFX`
path in `build.ps1` is for test certificates; production signing is wired to the chosen service. On the development
computer, `installer/sign-development.ps1` signs with a certificate from the Windows certificate store (the self-signed
BIZOMAT development certificate today, an OV certificate on a token or cloud service later) and checks every
signature: [BIZOMAT-DEV-SIGNING.md](BIZOMAT-DEV-SIGNING.md).

Use an OV or EV code-signing certificate. Every release must be signed: an unsigned add-in cannot be checked by the
Companion's publisher test, and Companions refuse to update to an unsigned MSI. Keep the certificate's thumbprint
stable across releases (the update check compares publishers); when it changes, ship one release signed by the old
and listed with the new thumbprint in `signer_thumbprints`, or ask people to install that one by hand.
