# Signs BIZOMAT CAD Automation for SOLIDWORKS with a code-signing certificate from the Windows certificate store, builds
# the signed MSI and checks every signature. Made for the BIZOMAT development certificate (self-signed, CN=BIZOMAT
# Development); the same script signs with a commercial OV certificate later: pass its -Thumbprint, nothing else changes.
# Windows PowerShell 5.1 or later, on the Windows development computer. See docs\BIZOMAT-DEV-SIGNING.md.
#
#   powershell -ExecutionPolicy Bypass -File installer\sign-development.ps1 -CreateCertificate -TrustOnThisComputer -Build -Backup
#
# Steps, each stopping with a plain message when it cannot go on:
#   1. SignTool: -SignToolPath, else the newest Windows SDK signtool.exe (x64), else PATH. Missing: -SdkSetup <path to
#      winsdksetup.exe from Microsoft> installs only "Windows SDK Signing Tools for Desktop Apps".
#   2. The certificate: -Thumbprint (or KEVOS_SIGN_THUMBPRINT), else the newest valid code-signing certificate with
#      -Subject in Cert:\CurrentUser\My that has its private key. None: -CreateCertificate makes one (RSA 3072, SHA-256,
#      2 years, private key not exportable). Its public part and a record go to installer\signing\. The private key
#      never leaves the certificate store: this script never exports it.
#   3. A self-signed certificate must be trusted on this computer for `signtool verify /pa` to pass:
#      -TrustOnThisComputer adds the public certificate to this Windows user's Trusted Root and Trusted Publishers
#      (Windows asks to confirm). This computer only; never do this on customers' computers.
#   4. The build (-Build runs `bash solidworks/build.sh test` with Git Bash), then installer\build.ps1 signs
#      OpenSketch.Sw.dll, KEVOS.Companion.exe and OpenSketchSW.exe (BIZOMAT's own files; the package has no third-party
#      binaries), packs them into the MSI and signs the MSI. SHA-256 file digests; an RFC 3161 SHA-256 timestamp from
#      -TimestampUrl unless -NoTimestamp.
#   5. Checks: each file with `signtool verify /pa /v` and Get-AuthenticodeSignature (valid, signed by this
#      certificate, timestamped when asked); the MSI is unpacked (msiexec /a) and the three files inside it are checked
#      too (-SkipMsiContentCheck to skip, and the report says so); the .sha256 files are checked.
#   6. installer\out\signing-report.txt and .json. -Backup copies the signed MSI, checksums, release record, report and
#      public certificate to backups\installer\development-signed\<version>-<date>\ (never into an existing folder).
# Exit code 0 only when every check passed.
[CmdletBinding()]
param(
    [string] $Thumbprint = $env:KEVOS_SIGN_THUMBPRINT,
    [string] $Subject = 'CN=BIZOMAT Development',
    [switch] $CreateCertificate,
    [switch] $TrustOnThisComputer,
    [string] $TimestampUrl = 'http://timestamp.digicert.com',
    [switch] $NoTimestamp,
    [string] $SignToolPath = '',
    [string] $SdkSetup = '',
    [switch] $Build,
    [switch] $Backup,
    [switch] $SkipMsiContentCheck,
    [string] $Version = ''
)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root
$OwnFiles = @('OpenSketch.Sw.dll', 'KEVOS.Companion.exe', 'OpenSketchSW.exe')
$dist = Join-Path $root 'solidworks\dist\OpenSketch-SOLIDWORKS'
$out = Join-Path $PSScriptRoot 'out'
$record = Join-Path $PSScriptRoot 'signing'

function Stop-Here([string] $why) {
    Write-Host ''
    Write-Host "Stopped: $why" -ForegroundColor Red
    Write-Host 'Nothing was deleted. Files already written are listed above.'
    exit 1
}
function Step([string] $what) { Write-Host ''; Write-Host "== $what" -ForegroundColor Cyan }
function Sha256([string] $path) { (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLower() }

# ------------------------------------------------------------------------------------------------ 1. SignTool
function Find-SignTool {
    if ($SignToolPath) { if (Test-Path -LiteralPath $SignToolPath) { return (Get-Item -LiteralPath $SignToolPath) } else { return $null } }
    $kits = Join-Path ${env:ProgramFiles(x86)} 'Windows Kits\10\bin'
    $found = Get-ChildItem -Path $kits -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match '^\d+\.\d+\.\d+\.\d+$' } |
        Sort-Object { [version] $_.Name } -Descending |
        ForEach-Object { Join-Path $_.FullName 'x64\signtool.exe' } |
        Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
    if (-not $found) { $found = Get-ChildItem (Join-Path $kits 'x64\signtool.exe') -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName }
    if (-not $found) { $found = Get-Command signtool.exe -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty Source }
    if ($found) { return (Get-Item -LiteralPath $found) }
    return $null
}

Step 'SignTool'
$signtool = Find-SignTool
if (-not $signtool -and $SdkSetup) {
    if (-not (Test-Path -LiteralPath $SdkSetup)) { Stop-Here "No file at $SdkSetup." }
    $s = Get-AuthenticodeSignature -LiteralPath $SdkSetup
    if ($s.Status -ne 'Valid' -or $s.SignerCertificate.Subject -notmatch 'O=Microsoft Corporation') {
        Stop-Here "$SdkSetup is not a setup program signed by Microsoft ($($s.Status)). Download winsdksetup.exe from https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/"
    }
    Write-Host 'Installing only "Windows SDK Signing Tools for Desktop Apps" (Windows asks for administrator rights).'
    $p = Start-Process -FilePath $SdkSetup -ArgumentList '/features', 'OptionId.SigningTools', '/quiet', '/norestart', '/ceip', 'off' -Wait -PassThru
    if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) { Stop-Here "The Windows SDK setup ended with code $($p.ExitCode)." }
    $signtool = Find-SignTool
}
if (-not $signtool) {
    Stop-Here ('signtool.exe was not found under "' + (Join-Path ${env:ProgramFiles(x86)} 'Windows Kits\10\bin') + '". ' +
        'Download the Windows SDK installer (winsdksetup.exe) from https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/ ' +
        'and run this script again with -SdkSetup <path to winsdksetup.exe>: it installs only the Signing Tools for Desktop Apps.')
}
$signtoolVersion = $signtool.VersionInfo.FileVersion
Write-Host "  $($signtool.FullName) (version $signtoolVersion)"

# ------------------------------------------------------------------------------------------------ 2. certificate
Step 'Code-signing certificate'
$now = Get-Date
$Thumbprint = ("$Thumbprint" -replace '[^0-9A-Fa-f]', '').ToUpper()
$cert = $null
if ($Thumbprint) {
    $cert = Get-ChildItem Cert:\CurrentUser\My, Cert:\LocalMachine\My -CodeSigningCert -ErrorAction SilentlyContinue |
        Where-Object { $_.Thumbprint -eq $Thumbprint } | Select-Object -First 1
    if (-not $cert) { Stop-Here "No code-signing certificate with thumbprint $Thumbprint in Cert:\CurrentUser\My or Cert:\LocalMachine\My." }
} else {
    $all = @(Get-ChildItem Cert:\CurrentUser\My -CodeSigningCert | Where-Object { $_.Subject -eq $Subject -and $_.HasPrivateKey -and $_.NotAfter -gt $now } |
        Sort-Object NotAfter -Descending)
    if ($all.Count -gt 1) { Write-Host "  $($all.Count) valid certificates named $Subject; using the one that lasts longest. Pass -Thumbprint to choose." -ForegroundColor Yellow }
    if ($all.Count -ge 1) { $cert = $all[0] }
    elseif ($CreateCertificate) {
        Write-Host "  None found: making $Subject in Cert:\CurrentUser\My (private key not exportable)."
        $cert = New-SelfSignedCertificate -Subject $Subject -Type CodeSigningCert -CertStoreLocation 'Cert:\CurrentUser\My' `
            -HashAlgorithm SHA256 -KeyAlgorithm RSA -KeyLength 3072 -NotAfter $now.AddYears(2) `
            -KeyExportPolicy NonExportable -FriendlyName 'BIZOMAT Development code signing'
    } else {
        Stop-Here "No valid code-signing certificate named $Subject with its private key in Cert:\CurrentUser\My. Run again with -CreateCertificate to make one, or pass -Thumbprint."
    }
}
if (-not $cert.HasPrivateKey) { Stop-Here "The certificate $($cert.Thumbprint) has no private key on this computer." }
if ($cert.NotAfter -le $now) { Stop-Here "The certificate $($cert.Thumbprint) expired on $($cert.NotAfter.ToString('yyyy-MM-dd'))." }
if ($cert.NotAfter -le $now.AddDays(30)) { Write-Host "  It expires on $($cert.NotAfter.ToString('yyyy-MM-dd')): make a new one soon." -ForegroundColor Yellow }
$selfSigned = $cert.Subject -eq $cert.Issuer
$thumb = $cert.Thumbprint
Write-Host "  subject     $($cert.Subject)"
Write-Host "  thumbprint  $thumb"
Write-Host "  valid       $($cert.NotBefore.ToString('yyyy-MM-dd')) to $($cert.NotAfter.ToString('yyyy-MM-dd'))"
Write-Host "  kind        $(if ($selfSigned) { 'self-signed development certificate (not trusted by other computers)' } else { 'issued by ' + $cert.Issuer })"

$cerFile = $null
if ($selfSigned) {
    # the public certificate and a record of it (both public: no private key in either)
    New-Item -ItemType Directory -Force -Path $record | Out-Null
    $cn = (($cert.Subject -replace '^CN=([^,]+).*$', '$1') -replace '[^A-Za-z0-9]+', '-').Trim('-')
    $cerFile = Join-Path $record "$cn.cer"
    $same = (Test-Path $cerFile) -and ((New-Object System.Security.Cryptography.X509Certificates.X509Certificate2 $cerFile).Thumbprint -eq $thumb)
    if (-not $same) {
        if (Test-Path $cerFile) { Move-Item $cerFile (Join-Path $record ("$cn-before-" + $now.ToString('yyyyMMdd-HHmmss') + '.cer')) }
        Export-Certificate -Cert $cert -FilePath $cerFile -Type CERT | Out-Null
    }
    @"
# BIZOMAT development code-signing certificate

Written by installer\sign-development.ps1 on $($now.ToString('yyyy-MM-dd HH:mm')). Public information only.

| Item | Value |
|---|---|
| Subject | $($cert.Subject) |
| Thumbprint (SHA-1) | $thumb |
| Serial number | $($cert.SerialNumber) |
| Valid from | $($cert.NotBefore.ToString('yyyy-MM-dd HH:mm')) |
| Expires | $($cert.NotAfter.ToString('yyyy-MM-dd HH:mm')) |
| Key | $($cert.PublicKey.Oid.FriendlyName) $($cert.PublicKey.Key.KeySize) bits, private key not exportable |
| Signature algorithm | $($cert.SignatureAlgorithm.FriendlyName) |
| Private key | in this Windows user's certificate store (Cert:\CurrentUser\My) on the development computer only |
| Public certificate | installer/signing/$cn.cer |

Self-signed: Windows on other computers does not trust it. It is not an OV or EV certificate and is for testing only.
"@ | Set-Content (Join-Path $record 'development-certificate.md') -Encoding UTF8
    Write-Host "  recorded in installer\signing\development-certificate.md (public certificate: $cn.cer)"
}

# ------------------------------------------------------------------------------------------------ 3. trust here
if ($selfSigned) {
    Step 'Trust on this computer'
    $inRoot = @(Get-ChildItem Cert:\CurrentUser\Root, Cert:\LocalMachine\Root | Where-Object { $_.Thumbprint -eq $thumb }).Count -gt 0
    $inPub = @(Get-ChildItem Cert:\CurrentUser\TrustedPublisher, Cert:\LocalMachine\TrustedPublisher | Where-Object { $_.Thumbprint -eq $thumb }).Count -gt 0
    if ((-not $inRoot -or -not $inPub) -and $TrustOnThisComputer) {
        if (-not $inRoot) { Write-Host '  Adding the public certificate to Trusted Root for this user (Windows asks to confirm).'; Import-Certificate -FilePath $cerFile -CertStoreLocation Cert:\CurrentUser\Root | Out-Null }
        if (-not $inPub) { Import-Certificate -FilePath $cerFile -CertStoreLocation Cert:\CurrentUser\TrustedPublisher | Out-Null }
        $inRoot = @(Get-ChildItem Cert:\CurrentUser\Root | Where-Object { $_.Thumbprint -eq $thumb }).Count -gt 0
    }
    if (-not $inRoot) {
        Stop-Here ('The development certificate is not trusted on this computer, so the signatures cannot be verified. Run again with ' +
            '-TrustOnThisComputer: it adds the public certificate (never the private key) to this Windows user''s Trusted Root and Trusted Publishers, on this computer only.')
    }
    Write-Host '  trusted by this Windows user on this computer only'
}

# ------------------------------------------------------------------------------------------------ timestamp
Step 'Timestamp service'
$ts = ''
if ($NoTimestamp) {
    Write-Host '  none (-NoTimestamp): the signatures stop being valid when the certificate expires.' -ForegroundColor Yellow
} else {
    $reachable = $false
    try { Invoke-WebRequest -Uri $TimestampUrl -Method Get -UseBasicParsing -TimeoutSec 15 | Out-Null; $reachable = $true }
    catch { if ($_.Exception.Response) { $reachable = $true } }  # any HTTP answer means the service is there
    if (-not $reachable) { Stop-Here "The timestamp service $TimestampUrl did not answer. Check the network, give another -TimestampUrl, or sign without a timestamp (-NoTimestamp)." }
    $ts = $TimestampUrl
    Write-Host "  $ts (RFC 3161, SHA-256)"
}

# ------------------------------------------------------------------------------------------------ 4. build and sign
if (-not $Version) { $Version = ([xml](Get-Content 'solidworks\Directory.Build.props')).Project.PropertyGroup.Version }
$suffix = if ($selfSigned) { '-DEV' } else { '' }
$msiName = "BIZOMAT-CAD-Automation-$Version-x64$suffix.msi"
$commit = ''; $dirty = $false
if (Get-Command git -ErrorAction SilentlyContinue) {
    $ErrorActionPreference = 'Continue'
    $commit = (git rev-parse HEAD 2>$null)
    $dirty = [bool](git status --porcelain -- solidworks installer LICENSE 2>$null)
    $ErrorActionPreference = 'Stop'
}

if ($Build) {
    Step 'Building the add-in and Companion (bash solidworks/build.sh test)'
    $bash = @("$env:ProgramFiles\Git\bin\bash.exe", "${env:ProgramFiles(x86)}\Git\bin\bash.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
    if (-not $bash) { Stop-Here 'Git Bash was not found (Git for Windows). Install it, or build first and run without -Build.' }
    $ErrorActionPreference = 'Continue'
    $sdks = @(if (Get-Command dotnet -ErrorAction SilentlyContinue) { dotnet --list-sdks 2>$null })
    $ErrorActionPreference = 'Stop'
    if (-not ($sdks | Where-Object { $_ -match '^(\d+)\.' -and [int]$Matches[1] -ge 8 })) {
        Stop-Here 'No .NET 8 SDK (or later) on this computer. Install it with: winget install --id Microsoft.DotNet.SDK.8 -e   then open a new PowerShell window and run this again.'
    }
    & $bash solidworks/build.sh test
    if ($LASTEXITCODE -ne 0) { Stop-Here 'The add-in build or its tests failed (above).' }
}
foreach ($f in $OwnFiles) { if (-not (Test-Path (Join-Path $dist $f))) { Stop-Here "No $dist\$f. Build first: run with -Build (or bash solidworks/build.sh test)." } }

Step "Signing and packaging $msiName"
New-Item -ItemType Directory -Force -Path $out | Out-Null
$old = @('BIZOMAT-CAD-Automation-x64.msi', 'CADOS-for-SOLIDWORKS-x64.msi', $msiName, 'release.json', 'signing-report.txt', 'signing-report.json') |
    ForEach-Object { Join-Path $out $_ } | Where-Object { Test-Path $_ }
if ($old) {
    # an earlier build: kept, not overwritten
    $keep = Join-Path $out ('previous-' + $now.ToString('yyyyMMdd-HHmmss'))
    New-Item -ItemType Directory -Force -Path $keep | Out-Null
    foreach ($o in $old) { Move-Item $o $keep; if (Test-Path "$o.sha256") { Move-Item "$o.sha256" $keep } }
    Write-Host "  the earlier build in installer\out moved to $keep"
}
try {
    & (Join-Path $PSScriptRoot 'build.ps1') -Version $Version -Timestamp $ts -CertThumbprint $thumb -SignToolPath $signtool.FullName -NameSuffix $suffix
} catch {
    Stop-Here "installer\build.ps1 failed: $($_.Exception.Message)"
}
Set-Location $root
$msi = Join-Path $out $msiName
if (-not (Test-Path $msi)) { Stop-Here "installer\build.ps1 did not make $msi." }

# ------------------------------------------------------------------------------------------------ 5. checks
Step 'Checking every signature'
$results = @()
function Check-Signature([string] $path, [string] $label) {
    # Windows PowerShell 5.1 turns a native program's error output into a terminating error under 'Stop'
    $ErrorActionPreference = 'Continue'
    $v = & $signtool.FullName verify /pa /v $path 2>&1 | Out-String
    $code = $LASTEXITCODE
    $ErrorActionPreference = 'Stop'
    $a = Get-AuthenticodeSignature -LiteralPath $path
    $signer = if ($a.SignerCertificate) { $a.SignerCertificate.Thumbprint } else { '' }
    $stamped = [bool]$a.TimeStamperCertificate
    $problems = @()
    if ($code -ne 0) { $problems += "signtool verify /pa failed (exit $code)" }
    if ("$($a.Status)" -ne 'Valid') { $problems += "Windows reports $($a.Status): $($a.StatusMessage)" }
    if ($signer -ne $thumb) { $problems += "signed by $(if ($signer) { $signer } else { 'nobody' }), not $thumb" }
    if ($ts -and -not $stamped) { $problems += 'no timestamp' }
    $ok = $problems.Count -eq 0
    Write-Host ("  {0}  {1}" -f $(if ($ok) { 'ok  ' } else { 'FAIL' }), $label) -ForegroundColor $(if ($ok) { 'Green' } else { 'Red' })
    foreach ($p in $problems) { Write-Host "        $p" -ForegroundColor Red }
    if (-not $ok) { Write-Host ($v.Trim() -replace '(?m)^', '        ') }
    return [pscustomobject]@{
        file = $label; sha256 = (Sha256 $path); size = (Get-Item -LiteralPath $path).Length; signer_thumbprint = $signer
        signer_subject = $(if ($a.SignerCertificate) { $a.SignerCertificate.Subject } else { '' }); status = "$($a.Status)"
        timestamped = $stamped; timestamp_signer = $(if ($a.TimeStamperCertificate) { $a.TimeStamperCertificate.Subject } else { '' })
        signtool_verify_exit = $code; ok = $ok; problems = $problems
    }
}
foreach ($f in $OwnFiles) { $results += Check-Signature (Join-Path $dist $f) "package\$f (before packaging)" }
$results += Check-Signature $msi $msiName

$inside = 'not checked (-SkipMsiContentCheck)'
if (-not $SkipMsiContentCheck) {
    # unpack the MSI (an administrative image: copies the files, installs nothing) and check the files it holds
    $img = Join-Path $env:TEMP ('bizomat-msi-' + [guid]::NewGuid().ToString('N'))
    $log = Join-Path $out 'msi-unpack.log'
    $p = Start-Process msiexec.exe -ArgumentList '/a', "`"$msi`"", '/qn', "TARGETDIR=`"$img`"", '/l*v', "`"$log`"" -Wait -PassThru
    if ($p.ExitCode -ne 0) {
        $inside = "could not be unpacked (msiexec /a exit $($p.ExitCode), log installer\out\msi-unpack.log)"
        $results += [pscustomobject]@{ file = "$msiName contents"; ok = $false; problems = @("msiexec /a ended with $($p.ExitCode); run again with -SkipMsiContentCheck to sign without this check") }
        Write-Host "  FAIL  the MSI could not be unpacked to check the files in it (msiexec /a exit $($p.ExitCode))" -ForegroundColor Red
    } else {
        foreach ($f in $OwnFiles) {
            $in = Get-ChildItem -Path $img -Recurse -Filter $f | Select-Object -First 1
            if (-not $in) {
                $results += [pscustomobject]@{ file = "$msiName > $f"; ok = $false; problems = @('not in the MSI') }
                Write-Host "  FAIL  $msiName > $f (not in the MSI)" -ForegroundColor Red
                continue
            }
            $r = Check-Signature $in.FullName "$msiName > $f"
            if ($r.sha256 -ne (Sha256 (Join-Path $dist $f))) { $r.ok = $false; $r.problems += 'differs from the signed file in the package'; Write-Host '        differs from the signed file in the package' -ForegroundColor Red }
            $results += $r
        }
        $inside = 'checked: the files in the MSI are the signed ones'
        Remove-Item $img -Recurse -Force -ErrorAction SilentlyContinue
    }
}

$msiHash = Sha256 $msi
$sums = @()
foreach ($n in @($msiName, 'BIZOMAT-CAD-Automation-x64.msi', 'CADOS-for-SOLIDWORKS-x64.msi')) {
    $file = Join-Path $out $n
    $line = if (Test-Path "$file.sha256") { (Get-Content "$file.sha256" -Raw).Trim() } else { '' }
    $ok = (Test-Path $file) -and ((Sha256 $file) -eq $msiHash) -and ($line -eq "$msiHash  $n")
    $sums += [pscustomobject]@{ file = $n; sha256 = $msiHash; ok = $ok }
    Write-Host ("  {0}  {1}.sha256" -f $(if ($ok) { 'ok  ' } else { 'FAIL' }), $n) -ForegroundColor $(if ($ok) { 'Green' } else { 'Red' })
}
$allOk = (@($results | Where-Object { -not $_.ok }).Count -eq 0) -and (@($sums | Where-Object { -not $_.ok }).Count -eq 0)

# ------------------------------------------------------------------------------------------------ 6. report
$report = [ordered]@{
    result = $(if ($allOk) { 'all signatures verified' } else { 'FAILED' })
    made_at = $now.ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ'); computer_user = "$env:USERNAME"
    version = $Version; msi = $msiName; msi_sha256 = $msiHash; source_commit = "$commit"; source_changed_locally = $dirty
    certificate = [ordered]@{ subject = $cert.Subject; issuer = $cert.Issuer; thumbprint = $thumb; serial = $cert.SerialNumber
        not_before = $cert.NotBefore.ToString('yyyy-MM-dd'); not_after = $cert.NotAfter.ToString('yyyy-MM-dd'); self_signed = $selfSigned
        store = $(if ($cert.PSParentPath -like '*LocalMachine*') { 'Cert:\LocalMachine\My' } else { 'Cert:\CurrentUser\My' }) }
    signtool = [ordered]@{ path = $signtool.FullName; version = $signtoolVersion }
    file_digest = 'sha256'; timestamp = $(if ($ts) { "$ts (RFC 3161, sha256)" } else { 'none' })
    files = $results; msi_contents = $inside; checksums = $sums
    trust_note = $(if ($selfSigned) { 'Self-signed development certificate: verified on this computer because it trusts the certificate. Other computers do not trust it.' } else { '' })
}
$report | ConvertTo-Json -Depth 6 | Set-Content (Join-Path $out 'signing-report.json') -Encoding UTF8
$txt = @("BIZOMAT CAD Automation for SOLIDWORKS: signing report", "Result: $($report.result)", "Made: $($report.made_at)",
    "Version: $Version   Commit: $commit$(if ($dirty) { ' (with local changes)' })", "MSI: $msiName", "MSI SHA-256: $msiHash",
    "Certificate: $($cert.Subject), thumbprint $thumb, valid $($report.certificate.not_before) to $($report.certificate.not_after)$(if ($selfSigned) { ', self-signed' })",
    "SignTool: $($signtool.FullName) $signtoolVersion", "Digest: SHA-256   Timestamp: $($report.timestamp)", "MSI contents: $inside", '', 'Files:')
foreach ($r in $results) { $txt += ("  {0}  {1}  {2}" -f $(if ($r.ok) { 'ok  ' } else { 'FAIL' }), $r.file, $(if ($r.ok) { "sha256 $($r.sha256), $($r.status), timestamped $($r.timestamped)" } else { $r.problems -join '; ' })) }
$txt += ''; $txt += 'Checksums:'
foreach ($s in $sums) { $txt += ("  {0}  {1}" -f $(if ($s.ok) { 'ok  ' } else { 'FAIL' }), $s.file) }
if ($selfSigned) { $txt += ''; $txt += $report.trust_note }
$txt | Set-Content (Join-Path $out 'signing-report.txt') -Encoding UTF8
Write-Host ''
Write-Host "Report: installer\out\signing-report.txt"

if (-not $allOk) { Stop-Here 'At least one signature check failed (above and in the report). The files are left in installer\out for inspection; do not publish them.' }

if ($Backup) {
    Step 'Backup'
    $dest = Join-Path $root ("backups\installer\development-signed\$Version-" + $now.ToString('yyyyMMdd-HHmm'))
    if (Test-Path $dest) { Stop-Here "$dest already exists; backups are never overwritten. Run again in a minute." }
    New-Item -ItemType Directory -Path $dest | Out-Null
    foreach ($n in @($msiName, "$msiName.sha256", 'release.json', 'signing-report.txt', 'signing-report.json')) { Copy-Item (Join-Path $out $n) $dest }
    if ($cerFile) { Copy-Item $cerFile $dest }
    foreach ($n in @($msiName)) { if ((Sha256 (Join-Path $dest $n)) -ne $msiHash) { Stop-Here "The copy in $dest differs from the signed MSI." } }
    $rel = $dest.Substring($root.Length + 1)
    Write-Host "  $rel"
    Write-Host '  To put it on GitHub (on a branch, then a pull request):'
    Write-Host "    git add -- `"$rel`" installer/signing"
    Write-Host "    git commit -m `"Development-signed installer $Version`""
    Write-Host '    git push'
}

Write-Host ''
Write-Host "Signed and verified: $msi" -ForegroundColor Green
Write-Host "SHA-256 $msiHash"
if ($selfSigned) { Write-Host 'Development certificate: other computers will show an untrusted publisher. For testing only.' -ForegroundColor Yellow }
exit 0
