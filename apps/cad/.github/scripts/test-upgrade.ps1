# Upgrades BIZOMAT CAD Automation for SOLIDWORKS from an earlier MSI to a newer one, silently, and checks the upgrade
# in place: one installed product, the new version in the install record and in Windows' list of apps, the new files,
# the add-in still registered, the Companion still starting at sign-in, and each person's settings and pairing kept
# (HKCU\Software\KEVOS and %LOCALAPPDATA%\KEVOS are never touched by the MSI). Then it uninstalls and checks that nothing
# is left. CI runs it on a Windows runner without SOLIDWORKS (.github/workflows/installer-test.yml, job "upgrade"). On a
# test PC, from an administrator PowerShell:
#   powershell -ExecutionPolicy Bypass -File .github\scripts\test-upgrade.ps1 -Old <older .msi> -New <newer .msi>
param([Parameter(Mandatory = $true)][string]$Old, [Parameter(Mandatory = $true)][string]$New,
      [string]$Gateway = 'https://bizomat.ai/cad')
$ErrorActionPreference = 'Stop'
$Old = (Resolve-Path $Old).Path
$New = (Resolve-Path $New).Path
$logs = if ($env:RUNNER_TEMP) { $env:RUNNER_TEMP } else { $env:TEMP }
$script:failed = @()
function Check([bool]$ok, [string]$what) {
  if ($ok) { Write-Host "ok    $what" } else { Write-Host "FAIL  $what"; $script:failed += $what }
}
function Msiexec([string]$arguments) { (Start-Process msiexec.exe -ArgumentList $arguments -Wait -PassThru).ExitCode }
function Value([string]$key, [string]$name) {
  $item = Get-ItemProperty -Path $key -ErrorAction SilentlyContinue
  if ($item) { $item.$name } else { $null }
}
# The ProductVersion property of an MSI, read with Windows Installer's own API.
function MsiVersion([string]$path) {
  $installer = New-Object -ComObject WindowsInstaller.Installer
  $db = $installer.GetType().InvokeMember('OpenDatabase', 'InvokeMethod', $null, $installer, @($path, 0))
  $view = $db.GetType().InvokeMember('OpenView', 'InvokeMethod', $null, $db, @("SELECT Value FROM Property WHERE Property = 'ProductVersion'"))
  $view.GetType().InvokeMember('Execute', 'InvokeMethod', $null, $view, $null) | Out-Null
  $record = $view.GetType().InvokeMember('Fetch', 'InvokeMethod', $null, $view, $null)
  $value = $record.GetType().InvokeMember('StringData', 'GetProperty', $null, $record, 1)
  $view.GetType().InvokeMember('Close', 'InvokeMethod', $null, $view, $null) | Out-Null
  $value
}
# Every entry in Windows' list of apps for this product, under any of its names (it was CADOS for SOLIDWORKS and
# KEVOS Bridge before).
function Entries {
  Get-ChildItem 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall' -ErrorAction SilentlyContinue |
    ForEach-Object { Get-ItemProperty $_.PSPath } |
    Where-Object { $_.DisplayName -match '^(BIZOMAT CAD Automation for SOLIDWORKS|CADOS for SOLIDWORKS|KEVOS Bridge)' }
}
function FileVersion([string]$path) { if (Test-Path $path) { (Get-Item $path).VersionInfo.FileVersion } else { $null } }

$oldVersion = MsiVersion $Old
$newVersion = MsiVersion $New
Write-Host "Upgrade $oldVersion -> $newVersion"
Check ([version]$newVersion -gt [version]$oldVersion) "the new MSI has a higher version ($newVersion > $oldVersion), as an upgrade needs"

$addin = '{275256ff-b73a-4e4f-9ea8-842b6626d471}'
$dir = Join-Path $env:ProgramFiles 'KEVOS\Bridge'
$run = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run'
$userKey = 'HKCU:\Software\KEVOS\Bridge'
$userDir = Join-Path $env:LOCALAPPDATA 'KEVOS\Bridge'
$marker = 'upgrade-test-' + [guid]::NewGuid().ToString('N')

Write-Host "Installing $(Split-Path $Old -Leaf)"
$code = Msiexec "/i `"$Old`" /qn /norestart GATEWAY_URL=$Gateway /l*v `"$logs\cados-upgrade-old.log`""
Check ($code -eq 0 -or $code -eq 3010) "the earlier version installed (exit code $code)"
Check ((Value 'HKLM:\SOFTWARE\KEVOS\Bridge' 'Version') -eq $oldVersion) "install record says $oldVersion"
Check (@(Entries).Count -eq 1) 'one entry in the list of apps'
$companionBefore = FileVersion (Join-Path $dir 'KEVOS.Companion.exe')

# What a paired computer keeps per person: settings in HKCU and data in %LOCALAPPDATA% (the device key is in the
# Windows key store, which no MSI touches). Stand-ins here, removed at the end.
New-Item -Path $userKey -Force | Out-Null
New-ItemProperty -Path $userKey -Name 'UpgradeTest' -Value $marker -PropertyType String -Force | Out-Null
New-Item -ItemType Directory -Path $userDir -Force | Out-Null
Set-Content -Path (Join-Path $userDir 'upgrade-test.txt') -Value $marker

Write-Host "Upgrading with $(Split-Path $New -Leaf)"
$code = Msiexec "/i `"$New`" /qn /norestart GATEWAY_URL=$Gateway /l*v `"$logs\cados-upgrade-new.log`""
Check ($code -eq 0 -or $code -eq 3010) "the upgrade finished (exit code $code)"
$entries = @(Entries)
Check ($entries.Count -eq 1) "one entry in the list of apps after the upgrade (found $($entries.Count))"
Check ($entries.Count -ge 1 -and $entries[0].DisplayVersion -eq $newVersion) "the list of apps shows $newVersion ($($entries | ForEach-Object DisplayVersion))"
Check ((Value 'HKLM:\SOFTWARE\KEVOS\Bridge' 'Version') -eq $newVersion) "install record says $newVersion"
$companionAfter = FileVersion (Join-Path $dir 'KEVOS.Companion.exe')
Check ("$companionAfter" -like "$newVersion*") "the Companion was replaced ($companionBefore -> $companionAfter)"
Check ("$(FileVersion (Join-Path $dir 'OpenSketch.Sw.dll'))" -like "$newVersion*") "the add-in was replaced ($(FileVersion (Join-Path $dir 'OpenSketch.Sw.dll')))"
$codebase = Value "HKLM:\SOFTWARE\Classes\CLSID\$addin\InprocServer32" 'CodeBase'
Check (("$codebase" -replace '\\', '/') -like '*/KEVOS/Bridge/OpenSketch.Sw.dll') "add-in COM class still registered ($codebase)"
Check ((Value "HKLM:\SOFTWARE\SolidWorks\Addins\$addin" 'Title') -eq 'BIZOMAT CAD Automation') 'still listed in SOLIDWORKS Add-Ins'
Check ((Value $run 'KEVOS Companion') -like '*KEVOS.Companion.exe*') 'the Companion still starts when a person signs in'
Check ((Value 'HKLM:\SOFTWARE\KEVOS\Bridge' 'GatewayUrl') -eq $Gateway) "service address $Gateway"
Check ((Value $userKey 'UpgradeTest') -eq $marker) "the person's settings kept ($userKey)"
Check ((Get-Content (Join-Path $userDir 'upgrade-test.txt') -ErrorAction SilentlyContinue) -eq $marker) "the person's data kept ($userDir)"

Write-Host 'Uninstalling'
$code = Msiexec "/x `"$New`" /qn /norestart /l*v `"$logs\cados-upgrade-uninstall.log`""
Check ($code -eq 0 -or $code -eq 3010) "uninstall finished (exit code $code)"
Check (@(Entries).Count -eq 0) 'nothing left in the list of apps'
Check (-not (Test-Path (Join-Path $dir 'KEVOS.Companion.exe'))) 'program files removed'
Check (-not (Test-Path "HKLM:\SOFTWARE\SolidWorks\Addins\$addin")) 'SOLIDWORKS listing removed'
Check ((Value $userKey 'UpgradeTest') -eq $marker) "the person's settings still kept after the uninstall"

Remove-ItemProperty -Path $userKey -Name 'UpgradeTest' -ErrorAction SilentlyContinue
Remove-Item (Join-Path $userDir 'upgrade-test.txt') -ErrorAction SilentlyContinue

if ($script:failed.Count) { Write-Host "$($script:failed.Count) check(s) failed. Logs: $logs\cados-upgrade-*.log"; exit 1 }
Write-Host 'All upgrade checks passed'
