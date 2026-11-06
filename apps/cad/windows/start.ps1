# Starts the CADOS server on this Windows PC. It asks for the public https address, if AI apps reach this PC through
# a tunnel (Enter for none). There is no server password: the first time, the home page asks you to create the owner
# account, and from then on everyone signs in with their own email and password.
# From the repository folder:   powershell -ExecutionPolicy Bypass -File windows\start.ps1
# Stop it with Ctrl+C. The home page opens in your browser: http://127.0.0.1:8000
param([int]$Port = 8000)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)

if (-not (Test-Path '.venv\Scripts\python.exe')) {
  Write-Host 'Run the setup first:  powershell -ExecutionPolicy Bypass -File windows\setup.ps1' -ForegroundColor Yellow
  exit 1
}

Write-Host 'CADOS server' -ForegroundColor Cyan
Write-Host 'The first time, the home page asks you to create the owner account. Until then nothing else answers through a tunnel.'
Remove-Item Env:OPENSKETCH_PASSWORD -ErrorAction SilentlyContinue   # no longer used

$public = Read-Host 'Public https address for AI apps (for example https://cados.example.com), or Enter for this PC only'
$public = $public.Trim().TrimEnd('/', '.')   # a full stop copied from a sentence would make a different address
# The address on this PC is not a public one: treat it as "none" rather than stopping.
if ($public -match '^(https?://)?(127\.0\.0\.1|localhost)(:\d+)?$') {
  Write-Host 'That is the address on this PC (for the browser and SOLIDWORKS), not a public one. Carrying on without a public address.'
  $public = ''
}
if ($public) {
  if ($public -notmatch '^https://') { Write-Host 'The public address must start with https://' -ForegroundColor Yellow; exit 1 }
  $env:OPENSKETCH_PUBLIC_URL = $public
}

Write-Host ''
Write-Host "Home page:            http://127.0.0.1:$Port"
Write-Host "SOLIDWORKS address:   http://127.0.0.1:$Port   (the key is on the home page)"
if ($public) { Write-Host "AI app connector:     $public/mcp" } else { Write-Host 'AI app connector:     needs a public address (see windows\README.md, step 6)' }
Write-Host 'Stop with Ctrl+C.'
Write-Host ''
& '.venv\Scripts\python.exe' -m opensketch --port $Port
