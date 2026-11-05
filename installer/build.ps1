# Builds KEVOS-Bridge-<version>-x64.msi from solidworks/dist/OpenSketch-SOLIDWORKS (run `bash solidworks/build.sh test`
# first). Windows only (WiX Toolset 5 needs Windows). Repeatable: the same sources give the same MSI contents.
#
#   powershell -ExecutionPolicy Bypass -File installer\build.ps1 [-Version 0.11.0]
#
# Signing (production): set KEVOS_SIGN_PFX (path to a code-signing .pfx) and KEVOS_SIGN_PASSWORD. The DLL and EXEs are
# signed before they go into the MSI, then the MSI itself, all with SHA-256 and an RFC 3161 timestamp. Without them the
# MSI is built unsigned and named *-UNSIGNED.msi: fine for testing, never for release (the companion refuses to update
# itself to an unsigned MSI, and an unsigned add-in cannot be checked by the companion's publisher test).
#
# Output in installer\out: the MSI, its SHA-256, and release.json (the record a KEVOS server publishes as
# bridge-release.json once msi_url points at where the MSI is hosted).
param([string]$Version = "", [string]$Timestamp = "http://timestamp.digicert.com")
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

if (-not $Version) {
  $props = [xml](Get-Content 'solidworks\Directory.Build.props')
  $Version = $props.Project.PropertyGroup.Version
}
$src = Join-Path $root 'solidworks\dist\OpenSketch-SOLIDWORKS'
if (-not (Test-Path (Join-Path $src 'KEVOS.Companion.exe'))) { throw "Build first: bash solidworks/build.sh test (no $src\KEVOS.Companion.exe)" }

# the licence (AGPL-3.0: the text goes with the program, and where the source is)
Copy-Item 'LICENSE' (Join-Path $src 'LICENSE.txt') -Force
@"
KEVOS Bridge $Version is free software under the GNU Affero General Public License v3.0 (LICENSE.txt).
Its complete source code is at https://github.com/jogkev-creator/opensketchyz (this version: tag bridge-v$Version).
"@ | Set-Content (Join-Path $src 'SOURCE.txt') -Encoding UTF8
$lic = (Get-Content 'LICENSE' -Raw) -replace '\\', '\\' -replace '\{', '\{' -replace '\}', '\}' -replace "`r?`n", "\par`r`n"
"{\rtf1\ansi\deff0{\fonttbl{\f0 Segoe UI;}}\fs16 $lic}" | Set-Content (Join-Path $src 'License.rtf') -Encoding ASCII

$signtool = Get-ChildItem "${env:ProgramFiles(x86)}\Windows Kits\10\bin\*\x64\signtool.exe" -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -First 1
$sign = $env:KEVOS_SIGN_PFX -and (Test-Path $env:KEVOS_SIGN_PFX) -and $signtool
function Sign($file) {
  & $signtool.FullName sign /fd sha256 /td sha256 /tr $Timestamp /f $env:KEVOS_SIGN_PFX /p $env:KEVOS_SIGN_PASSWORD /d "KEVOS Bridge" $file
  if ($LASTEXITCODE -ne 0) { throw "signing $file failed" }
}
if ($sign) {
  foreach ($f in 'OpenSketch.Sw.dll', 'KEVOS.Companion.exe', 'OpenSketchSW.exe') { Sign (Join-Path $src $f) }
} else {
  Write-Host 'No signing certificate (KEVOS_SIGN_PFX): building an UNSIGNED test MSI.' -ForegroundColor Yellow
}

if (-not (Get-Command wix -ErrorAction SilentlyContinue)) { dotnet tool install --global wix --version 5.0.2 | Out-Host }
wix extension add -g WixToolset.Util.wixext/5.0.2 WixToolset.UI.wixext/5.0.2 | Out-Host
$out = Join-Path $PSScriptRoot 'out'
New-Item -ItemType Directory -Force -Path $out | Out-Null
$name = "KEVOS-Bridge-$Version-x64" + $(if ($sign) { '' } else { '-UNSIGNED' }) + '.msi'
$msi = Join-Path $out $name
wix build installer\KEVOS-Bridge.wxs -arch x64 -ext WixToolset.Util.wixext -ext WixToolset.UI.wixext -d "Version=$Version" -d "Source=$src" -o $msi
if ($LASTEXITCODE -ne 0) { throw 'wix build failed' }
if ($sign) { Sign $msi }

$hash = (Get-FileHash $msi -Algorithm SHA256).Hash.ToLower()
$size = (Get-Item $msi).Length
$thumb = $null
if ($sign) { $thumb = (Get-AuthenticodeSignature $msi).SignerCertificate.Thumbprint }
"$hash  $name" | Set-Content (Join-Path $out "$name.sha256") -Encoding ASCII
@{ version = $Version; msi_url = "https://github.com/jogkev-creator/opensketchyz/releases/download/bridge-v$Version/$name";
   sha256 = "sha256:$hash"; size = $size; signer_thumbprints = @($thumb | Where-Object { $_ }); notes = "KEVOS Bridge $Version";
   published_at = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss.fffZ') } | ConvertTo-Json | Set-Content (Join-Path $out 'release.json') -Encoding UTF8
Write-Host "Built $msi ($size bytes, sha256 $hash)" -ForegroundColor Green
