# Installs an MSI of BIZOMAT CAD Automation for SOLIDWORKS silently, checks what it put on the computer, uninstalls it and checks that
# it is gone. CI runs it on a Windows runner without SOLIDWORKS (.github/workflows/installer-test.yml). On a test PC,
# from an administrator PowerShell:
#   powershell -ExecutionPolicy Bypass -File .github\scripts\test-install.ps1 -Msi <path to the .msi>
# It undoes what it installs; per-user settings and pairing (HKCU, %LOCALAPPDATA%, the key store) are never touched.
param([Parameter(Mandatory = $true)][string]$Msi, [string]$Gateway = 'https://bizomat.ai/cad')
$ErrorActionPreference = 'Stop'
$Msi = (Resolve-Path $Msi).Path
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

$addin = '{275256ff-b73a-4e4f-9ea8-842b6626d471}'
$dir = Join-Path $env:ProgramFiles 'KEVOS\Bridge'
$files = 'OpenSketch.Sw.dll', 'BIZOMAT.bmp', 'KEVOS.Companion.exe', 'KEVOS.Companion.exe.config', 'OpenSketchSW.exe',
         'OpenSketchSW.exe.config', 'OpenSketch.swb', 'README.txt', 'LICENSE.txt', 'SOURCE.txt'
$run = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run'

Write-Host "Installing $(Split-Path $Msi -Leaf)"
$code = Msiexec "/i `"$Msi`" /qn /norestart GATEWAY_URL=$Gateway /l*v `"$logs\cados-install.log`""
Check ($code -eq 0 -or $code -eq 3010) "install finished (exit code $code)"
foreach ($f in $files) { Check (Test-Path (Join-Path $dir $f)) "installed $f" }
$codebase = Value "HKLM:\SOFTWARE\Classes\CLSID\$addin\InprocServer32" 'CodeBase'
Check (("$codebase" -replace '\\', '/') -like '*/KEVOS/Bridge/OpenSketch.Sw.dll') "add-in COM class registered ($codebase)"
Check ((Value "HKLM:\SOFTWARE\SolidWorks\Addins\$addin" 'Title') -eq 'BIZOMAT CAD Automation') 'listed in SOLIDWORKS Add-Ins as BIZOMAT CAD Automation'
$icon = Value "HKLM:\SOFTWARE\SolidWorks\Addins\$addin" 'Icon Path'
Check ($icon -and $icon.EndsWith('BIZOMAT.bmp') -and (Test-Path $icon)) "with the BIZOMAT icon in Tools > Add-Ins ($icon)"
$version = Value 'HKLM:\SOFTWARE\KEVOS\Bridge' 'Version'
Check ([bool]$version) "install record (version $version)"
Check ((Value 'HKLM:\SOFTWARE\KEVOS\Bridge' 'GatewayUrl') -eq $Gateway) "service address $Gateway"
Check ((Value $run 'KEVOS Companion') -like '*KEVOS.Companion.exe*') 'the Companion starts when a person signs in'
# Load the add-in in a separate .NET Framework process, so the DLL is not held open during the uninstall.
$dll = Join-Path $dir 'OpenSketch.Sw.dll'
$loads = & powershell.exe -NoProfile -Command "try { [string][bool]([Reflection.Assembly]::LoadFrom('$dll').GetType('OpenSketch.Sw.SwAddin', `$true)) } catch { `$_.Exception.GetBaseException().Message }"
$loads = "$loads".Trim()
if ($loads -match 'SolidWorks\.Interop') { Write-Host "skip  the add-in type needs SOLIDWORKS' interop files, which this computer lacks ($loads)" }
else { Check ($loads -eq 'True') "the add-in loads in .NET Framework ($loads)" }

Write-Host 'Uninstalling'
$code = Msiexec "/x `"$Msi`" /qn /norestart /l*v `"$logs\cados-uninstall.log`""
Check ($code -eq 0 -or $code -eq 3010) "uninstall finished (exit code $code)"
foreach ($f in $files) { Check (-not (Test-Path (Join-Path $dir $f))) "removed $f" }
Check (-not (Value "HKLM:\SOFTWARE\Classes\CLSID\$addin\InprocServer32" 'CodeBase')) 'add-in COM class unregistered (no code base left)'
Check (-not (Test-Path "HKLM:\SOFTWARE\Classes\CLSID\$addin")) "add-in COM keys removed (0.12.3 and later)"
Check (-not (Test-Path "HKLM:\SOFTWARE\SolidWorks\Addins\$addin")) 'SOLIDWORKS listing removed'
Check (-not (Value $run 'KEVOS Companion')) 'start at sign-in removed'

if ($script:failed.Count) { Write-Host "$($script:failed.Count) check(s) failed. Logs: $logs\cados-install.log, $logs\cados-uninstall.log"; exit 1 }
Write-Host 'All install checks passed'
