# Development code signing

How the BIZOMAT CAD Automation for SOLIDWORKS installer is signed on the Windows development computer with a free,
self-signed development certificate, and how the same steps take a commercial OV certificate later.

## What it is, and what it is not

- A self-signed certificate, subject `CN=BIZOMAT Development`, made on the development computer. Its private key
  stays in that Windows user's certificate store (`Cert:\CurrentUser\My`), marked not exportable.
- It proves that a file has not changed since it was signed on that computer, and lets the add-in and Companion
  checks (same publisher) be tried out.
- It is not trusted by Windows on any other computer. Those show an unknown or untrusted publisher, and SmartScreen
  still warns. The Companion's updater refuses an MSI whose signature Windows does not trust. It is not an OV or EV
  certificate, and nothing may present it as one.
- Never export the private key, never make a `.pfx` of it, never commit one, and never add this certificate to a
  customer's trust store. `.gitignore` refuses `*.pfx`, `*.p12` and `*.pvk`; `tests/test_installer.py` checks the
  repository holds no private key.

## Files

| File | What |
|---|---|
| `installer/sign-development.ps1` | Finds or makes the certificate, finds or installs SignTool, builds, signs, checks, reports, backs up |
| `installer/build.ps1` | Builds the MSI. Signs with a store certificate (`-CertThumbprint` or `KEVOS_SIGN_THUMBPRINT`) or a `.pfx` (CI) |
| `installer/signing/development-certificate.md` | Written by the script: subject, thumbprint, serial, dates. Public |
| `installer/signing/BIZOMAT-Development.cer` | Written by the script: the public certificate only |
| `installer/out/signing-report.txt`, `.json` | Written by the script: every file, its SHA-256, signer, timestamp and check result |
| `backups/installer/original/` | Installers as released, before signing |
| `backups/installer/development-signed/` | Signed installers the script backed up (`-Backup`) |

## On the development computer

Needs Windows PowerShell 5.1, Git for Windows (Git Bash), the .NET 8 SDK and the repository in `C:\BIZOMAT\CADOS`.

1. SignTool. The script looks in `C:\Program Files (x86)\Windows Kits\10\bin\<version>\x64`. If it is not there,
   download the Windows SDK installer (`winsdksetup.exe`) from Microsoft,
   https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/, and pass it to the script with
   `-SdkSetup <path>`. The script checks that the file is signed by Microsoft, then installs only "Windows SDK Signing
   Tools for Desktop Apps" (`/features OptionId.SigningTools /quiet /norestart`).

2. First run: make the certificate, trust it on this computer, build, sign, check and back up:

   ```powershell
   cd C:\BIZOMAT\CADOS
   powershell -ExecutionPolicy Bypass -File installer\sign-development.ps1 -CreateCertificate -TrustOnThisComputer -Build -Backup
   ```

   - `-CreateCertificate` makes the certificate only if no valid `CN=BIZOMAT Development` with its private key is in
     `Cert:\CurrentUser\My`: RSA 3072, SHA-256, valid two years, `-Type CodeSigningCert`, private key not exportable.
   - `-TrustOnThisComputer` adds the public certificate to this Windows user's Trusted Root and Trusted Publishers.
     Windows asks to confirm the Trusted Root change. Without it the checks cannot pass, and the script stops before
     signing.
   - `-Build` runs `bash solidworks/build.sh test`. Without it the script uses the package already in
     `solidworks\dist\OpenSketch-SOLIDWORKS`.

3. Later runs: `installer\sign-development.ps1 -Build -Backup`. The script finds the certificate by its subject.
   Pass `-Thumbprint` to choose one.

What it signs: `OpenSketch.Sw.dll`, `KEVOS.Companion.exe` and `OpenSketchSW.exe` (BIZOMAT's own files; the package
holds no third-party binaries) before they go into the MSI, then the MSI. SHA-256 file digests and an RFC 3161 SHA-256
timestamp from `http://timestamp.digicert.com` (`-TimestampUrl` for another; `-NoTimestamp` signs without one, and
those signatures stop being valid when the certificate expires). A self-signed build is named
`BIZOMAT-CAD-Automation-<version>-x64-DEV.msi`; the stable copies (`BIZOMAT-CAD-Automation-x64.msi`,
`CADOS-for-SOLIDWORKS-x64.msi`) are the same file.

What it checks, and stops (exit code 1) if any check fails:

- each signed file with `signtool verify /pa /v` and `Get-AuthenticodeSignature`: valid, signed by this
  certificate, timestamped when a timestamp was asked for;
- the MSI unpacked as an administrative image (`msiexec /a`, installs nothing): the three files inside are the signed
  ones (`-SkipMsiContentCheck` skips this; the report then says "not checked");
- the `.sha256` files match the MSI.

An earlier build in `installer\out` is moved to `installer\out\previous-<time>`, never overwritten. A backup goes to a
new folder `backups\installer\development-signed\<version>-<yyyyMMdd-HHmm>`; the script refuses an existing one. It
prints the `git add` and `git commit` commands; commit on a branch and open a pull request.

CI runs the same script on every change to `solidworks/` or `installer/` (`installer-test.yml`) with a throwaway
certificate that exists only on the runner, then installs the signed MSI.

## Where the installer is served

The Download button (`/download/solidworks`, sign-in needed) gives the first of:

1. `OPENSKETCH_INSTALLER_URL` (a setting on the server), as a redirect;
2. an installer in the server's own data folder, `<data>/downloads/BIZOMAT-CAD-Automation-x64.msi` (on Fly the
   volume of the app `cados`: `/data/downloads/`), served by the server itself;
3. `msi_url` in `bridge-release.json` in the data folder, as a redirect;
4. `https://bizomat.ai/downloads/cad/BIZOMAT-CAD-Automation-x64.msi`, as a redirect (R2 bucket `bizomat-downloads`,
   put there by `tools/laptop/cloudflare.ps1 publish installer`).

`/download/solidworks.sha256` (the pages' "Installer checksum" link) answers with the SHA-256 of the file in 2, else
redirects to the `.sha256` next to 4.

On 8 Nov 2026 none of 1 to 3 was set, and 4 answered 404: bizomat.ai is served by the Fly app `bizomat`, whose website
has no `/downloads/` route (only the Cloudflare Worker version of the website has). Until bizomat.ai moves to
Cloudflare, put the installer on the volume (2):

```powershell
fly ssh console -a cados -C "mkdir -p /data/downloads"
fly ssh sftp shell -a cados
```

then, at the sftp prompt, `put <path to the .msi> /data/downloads/BIZOMAT-CAD-Automation-x64.msi`, and check with
`fly ssh console -a cados -C "sha256sum /data/downloads/BIZOMAT-CAD-Automation-x64.msi"`. Nothing to restart: the next
download gives the new file. To change it, put another file there (keep the one before as a backup first); to stop
serving it, remove it. After the move to Cloudflare the data folder holds no `downloads/`, and 4 takes over.

A development-signed installer is trusted only where its certificate is installed; elsewhere Windows shows an unknown
publisher, as for an unsigned one.

## Moving to a commercial OV certificate

Nothing in the installer changes. An OV certificate today comes on a hardware token or from a cloud signing service.
Both make the certificate appear in `Cert:\CurrentUser\My` (the token's driver or the service's client tool), so:

```powershell
powershell -ExecutionPolicy Bypass -File installer\sign-development.ps1 -Thumbprint <the OV certificate's thumbprint> -Build -Backup
```

The script then skips the development steps: no `-DEV` in the name, no record of the certificate, and no
`-TrustOnThisComputer` (the certificate chains to a public root). The checks are the same. A cloud service that signs
through its own tool instead of the store (for example Azure Artifact Signing) needs the `Sign` function in
`installer/build.ps1` changed to call that tool; the steps around it stay. For releases from CI, see
[KEVOS-SIGNING.md](KEVOS-SIGNING.md).
