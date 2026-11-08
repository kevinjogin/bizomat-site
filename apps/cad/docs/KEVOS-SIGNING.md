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
| Repository | https://github.com/jogkev-creator/CADOS (private since 7 Nov 2026: the free programme for open-source projects needs a public repository, so a paid service applies, such as Azure Trusted Signing or an OV code-signing certificate) |
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
