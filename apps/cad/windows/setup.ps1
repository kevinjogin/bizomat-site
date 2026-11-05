# OpenSketch server on this Windows PC: one-time setup (and again after you pull new code).
# From the repository folder:   powershell -ExecutionPolicy Bypass -File windows\setup.ps1
# Needs Python 3.12 and Node.js 20.6 or newer. Installs into .venv in this folder; nothing system-wide.
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)

function Stop-With($message) { Write-Host $message -ForegroundColor Yellow; exit 1 }

# Python 3.12 (the Python launcher "py" comes with the python.org and winget installs)
$pyOk = $false
try { & py -3.12 -c "import sys" 2>$null; $pyOk = ($LASTEXITCODE -eq 0) } catch { }
if (-not $pyOk) { Stop-With 'Python 3.12 is needed. Install it with:  winget install Python.Python.3.12   then run this again.' }

# Node.js 20.6 or newer (the sketch solver runs in node)
$node = $null
try { $node = (& node --version) } catch { }
if (-not $node) { Stop-With 'Node.js is needed. Install it with:  winget install OpenJS.NodeJS.LTS   then open a new window and run this again.' }
$v = [version]($node.TrimStart('v'))
if ($v -lt [version]'20.6') { Stop-With "Node.js $node is too old: 20.6 or newer is needed (winget install OpenJS.NodeJS.LTS)." }

# Python packages, pinned with hashes
if (-not (Test-Path '.venv\Scripts\python.exe')) { & py -3.12 -m venv .venv }
$python = '.venv\Scripts\python.exe'
& $python -m pip install --upgrade pip
& $python -m pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) { Stop-With 'Installing the Python packages failed (see above).' }
& $python -m pip install --no-deps -e .
if ($LASTEXITCODE -ne 0) { Stop-With 'Installing OpenSketch failed (see above).' }

# The SOLIDWORKS add-in, so the home page can offer it: the zip built by GitHub Actions (see windows\README.md)
$target = 'opensketch\static\downloads\OpenSketch-SOLIDWORKS.zip'
$found = Get-ChildItem -Path (Join-Path $HOME 'Downloads') -Filter 'OpenSketch-SOLIDWORKS*.zip' -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($found) {
  New-Item -ItemType Directory -Force -Path (Split-Path $target) | Out-Null
  Copy-Item $found.FullName $target -Force
  Write-Host "Add-in zip copied from $($found.FullName)."
} elseif (-not (Test-Path $target)) {
  Write-Host 'No add-in zip yet. Download it from GitHub (Actions > SOLIDWORKS add-in > the latest run > Artifacts) into Downloads; you can install it from there directly.' -ForegroundColor Yellow
}

Write-Host ''
Write-Host 'Setup done. Start the server with:  powershell -ExecutionPolicy Bypass -File windows\start.ps1' -ForegroundColor Green
