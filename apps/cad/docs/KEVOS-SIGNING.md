# Code signing KEVOS Bridge

## What gets signed

| File | What it is | Runs where |
|---|---|---|
| `OpenSketch.Sw.dll` | The KEVOS SOLIDWORKS add-in (COM, .NET Framework 4.8, x64) | Inside SOLIDWORKS |
| `KEVOS.Companion.exe` | The KEVOS Companion (tray app, .NET Framework 4.8, x64) | At Windows sign-in, as the user |
| `OpenSketchSW.exe` | The earlier per-user installer and fallback launcher | Only when the person runs it |
| `BIZOMAT-CAD-Automation-<version>-x64.msi` | The installer, holding the three files above | Once per computer, elevated |

All four are built by GitHub Actions (`.github/workflows/solidworks.yml`): the DLL and EXEs on a Linux runner and
again on the Windows runner that builds the MSI (`installer/build.ps1`). Signing must happen on the Windows runner:
the binaries first, then the MSI made from them.

Why it matters: Windows SmartScreen warns about unsigned downloads; the Companion's checks (the add-in and Companion
check each other's publisher, the updater refuses an MSI from another publisher) only become meaningful once
releases are signed; IT departments often block unsigned installers.

## Since June 2023 there is no exportable certificate file

Certificate authorities now issue code-signing keys only on a hardware token or in a cloud signing service. A
`.pfx` file is therefore available only for self-made test certificates. `installer/build.ps1` signs with a `.pfx`
(`KEVOS_SIGN_PFX`) for testing; production signing needs the workflow to call the chosen signing service instead.
That step is added once a service is chosen (below).

Until then, development builds are signed on the Windows development computer with a self-signed certificate
(`CN=BIZOMAT Development`, private key not exportable, kept in that computer's certificate store) by
`installer/sign-development.ps1`. Other computers do not trust it. See [BIZOMAT-DEV-SIGNING.md](BIZOMAT-DEV-SIGNING.md).

## Commercial certificate: what to buy and how it plugs in (16 Nov 2026; nothing bought yet)

**What to buy:** an OV (organisation validation) Authenticode code-signing certificate whose key is on a FIPS 140-2
Level 2 hardware token or in the certificate authority's cloud signing service. EV is not needed: Microsoft SmartScreen
no longer gives EV certificates instant reputation, so both kinds build it as people download. An IV (individual
validation) certificate shows a person's name instead of a business name.

**Whose name it shows:** the validated legal name. For "BIZOMAT" to show as the publisher, BIZOMAT must be a registered
company, or a registered business name with an ABN. The legal entity and ABN are not recorded yet; decide them first.

**Validation documents** (typical; the authority's own list rules): the entity's registration (an ASIC company extract,
or the business name registration and the ABN on the ABN Lookup register); an address and telephone number the
authority can confirm in a public directory, or an opinion letter from a lawyer or accountant; the applicant's
government photo ID; a verification call; and a delivery address for a hardware token.

**Providers and indicative prices** (US dollars a year, from reseller pages in Nov 2026; ask for AUD quotes): Sectigo
OV about USD 220 through resellers (an Australian reseller is SSL Trust); DigiCert OV about USD 439, with KeyLocker
cloud signing; SSL.com OV with eSigner cloud signing (priced by signings). Azure Artifact Signing (formerly Trusted
Signing, USD 9.99 a month) did not accept Australian organisations as far as could be found (a Microsoft Q&A answer of
March 2026); check its current country list before relying on it.

**How it plugs in, with no code change for the first signed release:**
1. A hardware token, or a cloud key that the authority makes appear in Windows (DigiCert KeyLocker and SSL.com eSigner
   offer this), puts the certificate in `Cert:\CurrentUser\My` on the Windows development computer. Build and sign
   there with `installer/build.ps1 -CertThumbprint <thumbprint>`: it signs the DLL, both EXEs and then the MSI with
   SHA-256 and an RFC 3161 timestamp (timestamp.digicert.com unless `-Timestamp` says otherwise), and refuses to fall
   back to unsigned. Check each file with `signtool verify /pa /v`. The token's PIN is typed by the person signing; no
   key, PIN or password goes into the repository, a commit or a log.
2. Back up the signed MSI under `backups/installer/` on a branch (as for the development-signed 0.13.1), then run
   `installer-volume.yml` with `signer` = the new thumbprint: it checks the signature and puts the file where Download
   for SOLIDWORKS serves it. `tools/laptop/cloudflare.ps1 publish installer` puts it on bizomat.ai/downloads once the
   website has R2 read access.
3. The Companion's updater installs only an MSI from the same publisher as the one installed. The first commercially
   signed release has a new publisher, so computers with a development-signed build install it once by hand (the MSI
   upgrades in place); updates after that work by themselves.
4. Later, signing in CI: the chosen provider's cloud signing in the `installer` job of `solidworks.yml`, with its
   credentials as repository secrets (never the key), in place of the `.pfx` path. Added once the provider is chosen.

## Options

| Option | Cost | Publisher shown in Windows | Fits KEVOS when | Notes |
|---|---|---|---|---|
| SignPath Foundation | Free for open source | "SignPath Foundation" (not KEVOS) | The repository is public and the project is open source | Signing runs through SignPath's GitHub integration; they check that the files come from your public source. |
| Azure Artifact Signing (formerly Trusted Signing) | Monthly fee (low) | Your validated name or company | Your company (or you, where individuals are accepted) passes Microsoft's identity validation | GitHub Action available; no hardware to manage. Check current eligibility for Australian individuals and companies. |
| A commercial OV certificate with cloud signing (for example SSL.com eSigner, DigiCert KeyLocker, Sectigo) | Yearly certificate plus the cloud-signing fee | Your validated company name | Always | Most widely accepted; costs most. |
| Certum open-source certificate | Low | Your name | Open source individuals | Uses a smart card or Certum's cloud; awkward in CI. |

Recommendation: if KEVOS is to stay a private, commercial product, use Azure Artifact Signing if your company is
eligible, else a commercial OV certificate with cloud signing. If you make the repository public under its AGPL
licence (the licence already obliges you to offer the source to users of a modified network service), apply to
SignPath Foundation.

## SignPath Foundation: what to prepare

These points come from SignPath's published conditions as known at the time of writing; the build environment could
not reach signpath.org to confirm them, so check the current pages (https://signpath.org/apply and the conditions it
links) before applying.

Conditions to meet first:
1. A public repository: `jogkev-creator/CADOS` is private today. SignPath signs only software whose source is public
   under an OSI-approved licence (AGPL-3.0 is one).
2. Releases built from that source by GitHub Actions on GitHub-hosted runners (already the case), submitted through
   SignPath's GitHub integration so they can verify each file's origin.
3. Two-factor authentication for everyone with write access to the repository.
4. A code-signing policy published with the project (for example a section in README.md): who may commit, who
   reviews, who approves signing, and the line "Free code signing provided by SignPath.io, certificate by SignPath
   Foundation".
5. A privacy statement. KEVOS sends data by design: commands, results and the files a command produces go to the
   KEVOS server the person registered the computer with, and nowhere else. Say so plainly.
6. Third-party code: the add-in embeds type information from the SOLIDWORKS 2022 API interop (no Dassault code is
   redistributed; it calls SOLIDWORKS on the user's own licence). Mention it.

Details for the application form:

| Field | KEVOS answer |
|---|---|
| Project name | KEVOS Bridge |
| Repository | https://github.com/kevinjogin/bizomat-cad (public since 14 Nov 2026; SignPath signs as "SignPath Foundation", not BIZOMAT, so a commercial certificate is the choice for a product sold under the BIZOMAT name) |
| Licence | GNU Affero General Public License v3.0 only |
| Description | Connects AI apps (Claude, ChatGPT and other MCP clients) to SOLIDWORKS on the user's own Windows computer. A COM add-in runs inside SOLIDWORKS; a tray app keeps a signed outbound link to the user's KEVOS server. |
| Files to sign | `OpenSketch.Sw.dll`, `KEVOS.Companion.exe`, `OpenSketchSW.exe`, `BIZOMAT-CAD-Automation-<version>-x64.msi` (Authenticode, SHA-256, timestamped) |
| Build system | GitHub Actions, GitHub-hosted `windows-latest`, workflow `.github/workflows/solidworks.yml`, job `installer` |
| Release channel | https://bizomat.ai/downloads/cad/ (`cloudflare.ps1 publish installer`; the GitHub releases are private) |
| Maintainers | (your name and GitHub account; reviewers and approvers) |

Once approved, SignPath gives an organization id, a project slug, a signing policy and an API token. Then the
`installer` job uploads the unsigned binaries as an artifact, submits them for signing, builds the MSI from the signed
files, and submits the MSI. Repository settings needed then: a secret `SIGNPATH_API_TOKEN` and variables
`SIGNPATH_ORGANIZATION_ID`, `SIGNPATH_PROJECT_SLUG`, `SIGNPATH_POLICY_SLUG`.
