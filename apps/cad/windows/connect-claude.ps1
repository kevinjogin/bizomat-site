# Adds OpenSketch to the Claude Desktop app on this PC (no tunnel needed).
# It asks for the private address from the OpenSketch home page ("Your app cannot sign in?"), writes it into
# Claude Desktop's settings (%APPDATA%\Claude\claude_desktop_config.json, keeping anything else there, with a
# backup), and restarts Claude Desktop.
# From the repository folder, with the server running (windows\start.ps1):
#   powershell -ExecutionPolicy Bypass -File windows\connect-claude.ps1
$ErrorActionPreference = 'Stop'

function Stop-With($message) { Write-Host $message -ForegroundColor Yellow; exit 1 }

# The server must be running, and Node.js installed (Claude Desktop starts the link with npx)
# A plain connection to port 8000 (no web proxy involved), so the check cannot be fooled by proxy settings.
$listening = $false
try { $tcp = New-Object System.Net.Sockets.TcpClient; $tcp.Connect('127.0.0.1', 8000); $listening = $tcp.Connected; $tcp.Close() } catch { }
if (-not $listening) {
  Write-Host 'Nothing is answering on http://127.0.0.1:8000, so the OpenSketch server does not seem to be running.' -ForegroundColor Yellow
  Write-Host 'Start it in another window first (and keep that window open): powershell -ExecutionPolicy Bypass -File windows\start.ps1'
  if ((Read-Host 'Continue anyway? (y/N)') -notmatch '^[yY]') { exit 1 }
}
if (-not (Get-Command npx -ErrorAction SilentlyContinue)) { Stop-With 'Node.js is needed: winget install OpenJS.NodeJS.LTS' }

Write-Host 'On the OpenSketch home page (http://127.0.0.1:8000), open "Your app cannot sign in?" and copy the private address.'
$address = (Read-Host 'Private address').Trim()
if ($address -notmatch '^https?://[^/\s]+/(solidworks/)?mcp/[^/\s]+$') {
  Stop-With 'That is not the private address. It looks like http://127.0.0.1:8000/mcp/ followed by a long code.'
}

$dir = Join-Path $env:APPDATA 'Claude'
$file = Join-Path $dir 'claude_desktop_config.json'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$config = $null
if (Test-Path $file) {
  Copy-Item $file "$file.bak" -Force
  $text = Get-Content $file -Raw
  if ($text -and $text.Trim()) {
    try { $config = $text | ConvertFrom-Json } catch { Stop-With "Claude Desktop's settings file is not valid JSON, so it was left as it is: $file" }
  }
}
if (-not $config) { $config = [pscustomobject]@{} }
if (-not $config.PSObject.Properties['mcpServers']) { $config | Add-Member -NotePropertyName mcpServers -NotePropertyValue ([pscustomobject]@{}) }

# cmd /c, because npx is a .cmd file on Windows; --allow-http for an address on this PC
$linkArgs = @('/c', 'npx', '-y', 'mcp-remote', $address)
if ($address -like 'http://*') { $linkArgs += '--allow-http' }
$entry = [pscustomobject]@{ command = 'cmd'; args = $linkArgs }
$config.mcpServers | Add-Member -NotePropertyName opensketch -NotePropertyValue $entry -Force

# UTF-8 without a byte order mark (a BOM breaks the JSON for Claude Desktop)
$json = $config | ConvertTo-Json -Depth 20
[IO.File]::WriteAllText($file, $json, (New-Object System.Text.UTF8Encoding $false))
Write-Host "OpenSketch added to $file" -ForegroundColor Green

# Restart Claude Desktop so it loads the new setting
$running = Get-Process -Name 'Claude' -ErrorAction SilentlyContinue
if ($running) { $running | Stop-Process -Force; Start-Sleep -Seconds 2 }
$exe = Join-Path $env:LOCALAPPDATA 'AnthropicClaude\claude.exe'
if (Test-Path $exe) { Start-Process $exe; Write-Host 'Claude Desktop restarted.' }
else { Write-Host 'Open Claude Desktop now (it was closed so it reads the new setting).' }

Write-Host ''
Write-Host 'In Claude Desktop, start a new chat and ask:  Run the SOLIDWORKS self test, all three stages.'
Write-Host 'Keep the server window open while you work.'
