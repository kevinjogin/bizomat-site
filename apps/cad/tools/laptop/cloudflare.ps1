<#
.SYNOPSIS
  BIZOMAT on Cloudflare, from your own computer: the deploys, the data moves and the switch of bizomat.ai.

.DESCRIPTION
  Keep this file next to bizomat.ps1, in the folder that holds CADOS and gocore-website (.\bizomat.ps1 setup makes
  them). The repositories are private, so take it from your signed-in clone, not from a raw GitHub link:
    git -C C:\BIZOMAT\CADOS pull
    copy C:\BIZOMAT\CADOS\tools\laptop\cloudflare.ps1 C:\BIZOMAT\
  Sign in to Cloudflare once: cd gocore-website; npx wrangler login. Then, in this order:

    .\cloudflare.ps1 check             what is ready: tools, the Cloudflare sign-in and plan, what exists (read only)
    .\cloudflare.ps1 deploy mcp        CAD Automation's Worker bizomat-mcp and its container (CADOS main, Docker).
                                       The first deploy creates the R2 bucket and the address mcp.bizomat.ai
    .\cloudflare.ps1 deploy tasks      Project Management's Worker bizomat-tasks (gocore-website main). The first
                                       deploy creates its D1 database, R2 bucket and KV namespace
    .\cloudflare.ps1 deploy website    the website's Worker bizomat (gocore-website main). bizomat.ai stays on Fly
                                       until the switch
    .\cloudflare.ps1 secrets website   the website's secrets on the Worker bizomat, typed at hidden prompts
    .\cloudflare.ps1 secrets mcp       the secrets the Fly app cados has that change how CAD Automation works (the
                                       private address seed, Google sign-in), copied to bizomat-mcp unseen
    .\cloudflare.ps1 move tasks        Project Management's data, from Fly to D1 and R2. -Final for the last copy: it
                                       puts the Fly work Machine in maintenance first
    .\cloudflare.ps1 move cad          CAD Automation's data folder, from Fly to R2. Run it right before the switch.
                                       -Local rehearses into a folder on this computer; -Replace puts a new copy over
                                       one already in R2 (CAD Automation on Cloudflare is paused meanwhile)
    .\cloudflare.ps1 publish installer -File <msi>
                                       the SOLIDWORKS installer on bizomat.ai/downloads/cad/ (R2), with its SHA-256
                                       and the release record that downloads and Companion updates read. The GitHub
                                       repositories are private, so their releases are for you only
    .\cloudflare.ps1 switch            the switch of bizomat.ai, step by step, with its checks; changes nothing itself
    .\cloudflare.ps1 status            who answers at each address now

  A deploy sends exactly what GitHub holds on main: the folder must be on main, have no local changes and match
  GitHub. Before anything changes, the script shows what it will do and asks you to type yes; -DryRun stops there.
  Nothing here stops, scales down or deletes a Fly app: only move tasks -Final changes Fly, by putting Project
  Management there in maintenance after you type yes. Secrets are never shown or kept.

.PARAMETER DryRun
  Run every check and stop before changing anything.

.PARAMETER SkipChecks
  Deploy without the repository's own checks (the build still runs). Not recommended.

.PARAMETER Final
  move tasks only: the last copy before the switch. The Fly work Machine goes into maintenance first, so nothing
  saved afterwards stays behind on Fly.

.PARAMETER Replace
  move tasks and move cad: put the copy over data already on Cloudflare (what is there is kept on this computer
  first; for CAD Automation the server on Cloudflare is paused meanwhile, so it cannot write over the new copy).

.PARAMETER Local
  move cad only: a rehearsal: the copy goes into a local R2 folder on this computer, not to Cloudflare.

.PARAMETER ApplyMigrations
  deploy tasks only: apply waiting database migrations to bizomat-tasks-db (a Time Travel point is shown first).

.PARAMETER File
  publish installer only: the MSI to publish (BIZOMAT-CAD-Automation-<version>-x64.msi, from the GitHub release or
  installer\build.ps1).

.PARAMETER Version
  publish installer only: the version, when the file name does not carry it.

.PARAMETER CadApp
  move cad only: the Fly app CAD Automation runs on now: cados (default), or bizomat after bizomat.ps1 move cad.
#>
[CmdletBinding()]
param(
    [Parameter(Position = 0)] [ValidateSet('check', 'deploy', 'secrets', 'move', 'publish', 'switch', 'status', 'help')] [string] $Command = 'help',
    [Parameter(Position = 1)] [ValidateSet('mcp', 'tasks', 'website', 'cad', 'installer')] [string] $App = '',
    [string] $File = '',
    [string] $Version = '',
    [switch] $DryRun,
    [switch] $SkipChecks,
    [switch] $Final,
    [switch] $Replace,
    [switch] $Local,
    [switch] $ApplyMigrations,
    [ValidateSet('cados', 'bizomat')] [string] $CadApp = 'cados'
)

Set-StrictMode -Version 2.0
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Root = $PSScriptRoot
$Owner = 'jogkev-creator'
$IsWin = ($env:OS -eq 'Windows_NT')
$Curl = if ($IsWin) { 'curl.exe' } else { 'curl' }
$NullDevice = if ($IsWin) { 'NUL' } else { '/dev/null' }

# The names on Cloudflare (gocore-website wrangler.toml and apps/work/wrangler.jsonc env bizomat; CADOS cloudflare/mcp)
$Workers = [ordered]@{ 'bizomat-mcp' = 'CAD Automation'; 'bizomat-tasks' = 'Project Management'; 'bizomat' = 'the website' }
$CadBucket = 'bizomat-mcp-data'
$TasksDb = 'bizomat-tasks-db'
$TasksBucket = 'bizomat-tasks-files'
$McpHost = 'mcp.bizomat.ai'
$DownloadsBucket = 'bizomat-downloads'
$Downloads = 'https://bizomat.ai/downloads/cad'

# ----------------------------------------------------------------------------- helpers (as in bizomat.ps1)

function Write-Title([string] $Text) { Write-Host ''; Write-Host "== $Text" -ForegroundColor Cyan }

function Stop-Here([string] $Text) {
    Write-Host ''
    Write-Host "STOP: $Text" -ForegroundColor Red
    exit 1
}

function Invoke-Step {
    # Runs a program with its output on screen; stops the script if it fails.
    param([string] $Exe, [string[]] $Arguments, [string] $In = $Root)
    Write-Host "> $Exe $($Arguments -join ' ')" -ForegroundColor DarkGray
    Push-Location -LiteralPath $In
    try { & $Exe @Arguments; $code = $LASTEXITCODE } finally { Pop-Location }
    if ($code -ne 0) { Stop-Here "$Exe $($Arguments -join ' ') failed (exit code $code)." }
}

function Get-Output {
    # A program's output as text, or $null if it fails. Its error output is not shown.
    param([string] $Exe, [string[]] $Arguments, [string] $In = $Root)
    $saved = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    Push-Location -LiteralPath $In
    try { $out = & $Exe @Arguments 2>$null; $code = $LASTEXITCODE } finally { Pop-Location; $ErrorActionPreference = $saved }
    if ($code -ne 0) { return $null }
    return (($out | Out-String).Trim())
}

function Test-Exit {
    # $true when the program exits with 0.
    param([string] $Exe, [string[]] $Arguments, [string] $In = $Root)
    $saved = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    Push-Location -LiteralPath $In
    try { & $Exe @Arguments 2>$null | Out-Null; $ok = ($LASTEXITCODE -eq 0) } finally { Pop-Location; $ErrorActionPreference = $saved }
    return $ok
}

function Test-Tool([string] $Name) { return [bool](Get-Command $Name -ErrorAction SilentlyContinue) }

function Assert-Tool([string] $Name, [string] $Hint) {
    if (-not (Test-Tool $Name)) { Stop-Here "$Name is not installed. $Hint" }
}

function Assert-Node {
    Assert-Tool 'node' 'Install Node.js 22 LTS (22.19 or newer) from https://nodejs.org, then open a new PowerShell window.'
    Assert-Tool 'npm' 'npm comes with Node.js: reinstall Node.js 22 LTS from https://nodejs.org.'
    $v = (Get-Output 'node' @('--version')) -replace '^v', ''
    if (-not $v -or [version]$v -lt [version]'22.19.0') { Stop-Here "Node.js $v is too old: 22.19 or newer is needed (https://nodejs.org)." }
}

function Get-Code([string] $Url) {
    # The HTTP status of one GET, without following redirects (0 when there is no answer).
    $code = Get-Output $Curl @('-s', '-o', $NullDevice, '-w', '%{http_code}', '-m', '30', '-A', 'bizomat-local', $Url)
    if ($code -match '^\d+$') { return [int]$code }
    return 0
}

function Get-Json([string] $Url) {
    try { return Invoke-RestMethod -UseBasicParsing -TimeoutSec 30 -Uri $Url -Headers @{ 'User-Agent' = 'bizomat-local' } }
    catch { return $null }
}

function Get-Prop($Obj, [string] $Name) {
    # A property of a parsed JSON object, or $null where it is missing (Set-StrictMode would stop on it).
    if ($null -eq $Obj) { return $null }
    $p = $Obj.PSObject.Properties[$Name]
    if ($p) { return $p.Value }
    return $null
}

function Get-ServedBy([string] $Url) {
    # Who answered: Cloudflare (a Worker, cf-ray and no Fly header), Fly (fly-request-id), or nobody.
    $h = Get-Output $Curl @('-s', '-I', '-m', '30', '-A', 'bizomat-local', $Url)
    if (-not $h) { return 'no answer' }
    $fly = $h -match '(?im)^fly-request-id:'
    $cf = $h -match '(?im)^cf-ray:'
    if ($fly) { return 'Fly' }
    if ($cf) { return 'Cloudflare' }
    return 'another server'
}

function Get-Dns([string] $Name, [string] $Type) {
    # Public DNS answers (Google's DNS over HTTPS), or @() when there are none.
    $r = Get-Json "https://dns.google/resolve?name=$Name&type=$Type"
    if (-not $r) { return @() }
    $answers = Get-Prop $r 'Answer'
    if (-not $answers) { return @() }
    return @(@($answers) | ForEach-Object { "$(Get-Prop $_ 'data')".TrimEnd('.') })
}

function Show-Domain {
    # bizomat.ai in Cloudflare: its nameservers and records from public DNS, and the zone in the account when
    # CLOUDFLARE_API_TOKEN is set (read only; the token is never shown).
    Write-Title 'bizomat.ai'
    $ns = Get-Dns 'bizomat.ai' 'NS'
    if (@($ns | Where-Object { $_ -like '*.ns.cloudflare.com' }).Count -gt 0) { Write-Host "  ok    its nameservers are Cloudflare's ($($ns -join ', '))" -ForegroundColor Green }
    else { Write-Host "  FAIL  its nameservers are not Cloudflare's ($($ns -join ', ')): the zone must be on Cloudflare" -ForegroundColor Red }
    foreach ($n in @('bizomat.ai', 'www.bizomat.ai', $McpHost)) {
        $a = @(Get-Dns $n 'A') + @(Get-Dns $n 'AAAA')
        $what = if ($a.Count -eq 0) { 'no record yet' } else { $a -join ', ' }
        Write-Host "  dns   $($n.PadRight(15)) $what"
    }
    if ($env:CLOUDFLARE_API_TOKEN) {
        try {
            $z = Invoke-RestMethod -UseBasicParsing -TimeoutSec 30 -Uri 'https://api.cloudflare.com/client/v4/zones?name=bizomat.ai' `
                -Headers @{ Authorization = "Bearer $env:CLOUDFLARE_API_TOKEN"; 'User-Agent' = 'bizomat-local' }
            $zone = @(Get-Prop $z 'result') | Select-Object -First 1
            if ($zone) {
                $plan = Get-Prop (Get-Prop $zone 'plan') 'name'
                $account = Get-Prop (Get-Prop $zone 'account') 'name'
                Write-Host "  ok    bizomat.ai is a zone of the account '$account' (status $(Get-Prop $zone 'status'), plan $plan)" -ForegroundColor Green
            } else { Write-Host '  FAIL  bizomat.ai is not a zone this token can see: add it to the account, or use a token of the right account' -ForegroundColor Red }
        } catch { Write-Host '  note  the API token did not answer for zones (it needs Zone: Read for bizomat.ai)' -ForegroundColor Yellow }
    } else {
        Write-Host '  note  with wrangler login, confirm in the dashboard that Websites lists bizomat.ai as Active in this account.' -ForegroundColor Yellow
        Write-Host '        deploy mcp checks it too: it stops if bizomat.ai is not a zone of the signed-in account.' -ForegroundColor Yellow
    }
}

function Get-DefaultBranch([string] $Dir) {
    if (-not (Test-Exit 'git' @('remote', 'set-head', 'origin', '--auto') $Dir)) { Stop-Here "GitHub did not say which branch is $Dir's default." }
    $ref = Get-Output 'git' @('symbolic-ref', '--quiet', '--short', 'refs/remotes/origin/HEAD') $Dir
    if (-not $ref) { Stop-Here "Cannot tell the default branch of $Dir." }
    return ($ref -replace '^origin/', '')
}

function Get-DeployCommit([string] $Repo) {
    # The folder must be on the default branch, clean and equal to GitHub (one that is only behind is brought up to
    # date; one with commits GitHub does not have is refused): an old checkout once replaced the website (8 Oct 2026).
    $dir = Join-Path $Root $Repo
    if (-not (Test-Path -LiteralPath (Join-Path $dir '.git'))) { Stop-Here "$Repo is not in $Root. Run: .\bizomat.ps1 setup" }
    Invoke-Step 'git' @('fetch', '--prune', '--quiet', 'origin') $dir
    $branch = Get-DefaultBranch $dir
    $here = Get-Output 'git' @('rev-parse', '--abbrev-ref', 'HEAD') $dir
    if ($here -ne $branch) { Stop-Here "$Repo is on '$here'. Deploys come only from '$branch'. Switch with: git -C `"$dir`" switch $branch" }
    $changes = Get-Output 'git' @('status', '--porcelain') $dir
    if ($changes) { Stop-Here "$Repo has local changes, and a deploy must match GitHub exactly. Put them on GitHub through a pull request, or undo them:`n$changes" }
    $head = Get-Output 'git' @('rev-parse', 'HEAD') $dir
    $remote = Get-Output 'git' @('rev-parse', "origin/$branch") $dir
    if ($head -ne $remote) {
        if (Test-Exit 'git' @('merge-base', '--is-ancestor', 'HEAD', "origin/$branch") $dir) {
            Write-Host "Bringing $Repo up to GitHub's $branch ..."
            Invoke-Step 'git' @('merge', '--ff-only', '--quiet', "origin/$branch") $dir
            $head = $remote
        } else {
            Stop-Here "$Repo has commits that GitHub does not have. Put them on GitHub through a pull request first."
        }
    }
    $subject = Get-Output 'git' @('log', '-1', '--format=%s', 'HEAD') $dir
    $when = Get-Output 'git' @('log', '-1', '--format=%cd', '--date=format:%Y-%m-%d %H:%M', 'HEAD') $dir
    return @{ Repo = $Repo; Dir = $dir; Branch = $branch; Commit = $head; Short = $head.Substring(0, 7); Subject = $subject; When = $when }
}

function Show-Commit($C) {
    Write-Host "Will deploy $($C.Repo) $($C.Branch) at $($C.Short) ($($C.When)): $($C.Subject)" -ForegroundColor White
}

function Confirm-Step([string] $Question) {
    # $true when you type yes. -DryRun stops here.
    if ($DryRun) { Write-Host 'Dry run: every check is done; stopping before any change.' -ForegroundColor Yellow; return $false }
    Write-Host ''
    $typed = Read-Host "$Question Type yes to go ahead (anything else stops)"
    if ("$typed".Trim() -ne 'yes') { Write-Host 'Stopped. Nothing was changed.'; exit 0 }
    return $true
}

function Invoke-Checks($Checks) {
    # Each check: @{ What = '...'; Test = { $true/$false }; Info = $true when it only informs }. $true if all hard ones pass.
    $all = $true
    foreach ($c in $Checks) {
        $ok = $false
        try { $ok = [bool](& $c.Test) } catch { $ok = $false }
        $info = $c.ContainsKey('Info') -and $c.Info
        if ($ok) { Write-Host "  ok    $($c.What)" -ForegroundColor Green }
        elseif ($info) { Write-Host "  note  $($c.What): not yet" -ForegroundColor Yellow }
        else { Write-Host "  FAIL  $($c.What)" -ForegroundColor Red; $all = $false }
    }
    return $all
}

function Wait-Until([scriptblock] $Test, [int] $Seconds) {
    $end = (Get-Date).AddSeconds($Seconds)
    while ((Get-Date) -lt $end) {
        try { if (& $Test) { return $true } } catch { }
        Start-Sleep -Seconds 5
    }
    return $false
}

function Write-DeployLog([string] $What, $C, [string] $Result) {
    $who = $env:USERNAME
    if (-not $who) { $who = $env:USER }
    [pscustomobject]@{
        When = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss zzz'); App = $What; Repository = $C.Repo; Commit = $C.Short
        Subject = $C.Subject; Result = $Result; By = $who
    } | Export-Csv -LiteralPath (Join-Path $Root 'deploy-log.csv') -Append -NoTypeInformation -Encoding UTF8
}

# ----------------------------------------------------------------------------- wrangler

function Get-Wrangler([string] $Dir) {
    # The wrangler of that folder (its package-lock.json pins it), after npm ci there.
    $w = Join-Path (Join-Path (Join-Path (Join-Path $Dir 'node_modules') 'wrangler') 'bin') 'wrangler.js'
    if (-not (Test-Path -LiteralPath $w)) { Invoke-Step 'npm' @('ci', '--no-audit', '--no-fund') $Dir }
    if (-not (Test-Path -LiteralPath $w)) { Stop-Here "wrangler is not in $Dir after npm ci." }
    return $w
}

function Get-SiteDir {
    $dir = Join-Path $Root 'gocore-website'
    if (-not (Test-Path -LiteralPath (Join-Path $dir '.git'))) { Stop-Here "gocore-website is not in $Root. Run: .\bizomat.ps1 setup" }
    return $dir
}

$AccountHint = 'If wrangler sees more than one Cloudflare account: $env:CLOUDFLARE_ACCOUNT_ID = ''<the account ID>'', then run this again.'

function Test-SignedIn {
    $site = Get-SiteDir
    $w = Get-Wrangler $site
    $who = Get-Output 'node' @($w, 'whoami') $site
    return ($who -and ($who -match 'logged in'))
}

function Assert-SignedIn {
    if (-not (Test-SignedIn)) { Stop-Here "wrangler is not signed in to Cloudflare. Run: cd `"$(Get-SiteDir)`"; npx wrangler login. $AccountHint" }
}

function Test-Worker([string] $Name) {
    $site = Get-SiteDir
    return (Test-Exit 'node' @((Get-Wrangler $site), 'deployments', 'list', '--name', $Name) $site)
}

function Test-Bucket([string] $Name) {
    $site = Get-SiteDir
    return (Test-Exit 'node' @((Get-Wrangler $site), 'r2', 'bucket', 'info', $Name) $site)
}

function Test-Database([string] $Name) {
    $site = Get-SiteDir
    return (Test-Exit 'node' @((Get-Wrangler $site), 'd1', 'info', $Name) $site)
}

# ----------------------------------------------------------------------------- check and status

function Show-Status {
    Write-Title 'Who answers now'
    $site = Get-ServedBy 'https://bizomat.ai/'
    $line = "  bizomat.ai             $site"
    if ($site -eq 'Fly') { $line += ' (before the switch)' } elseif ($site -eq 'Cloudflare') { $line += ' (the Worker bizomat: switched)' }
    Write-Host $line
    $cad = Get-Json 'https://bizomat.ai/cad/healthz'
    if ($cad) { Write-Host "  bizomat.ai/cad         $(Get-ServedBy 'https://bizomat.ai/cad/healthz'), CAD Automation $(Get-Prop $cad 'version')" }
    else { Write-Host "  bizomat.ai/cad         HTTP $(Get-Code 'https://bizomat.ai/cad/healthz')" }
    Write-Host "  bizomat.ai/tasks       HTTP $(Get-Code 'https://bizomat.ai/tasks/'), $(Get-ServedBy 'https://bizomat.ai/tasks/')"
    $w = Get-Json "https://$McpHost/__worker/health"
    if ($w) { Write-Host "  $McpHost         the Worker bizomat-mcp $(Get-Prop $w 'version')$(if (Get-Prop $w 'paused') { ', paused' })" } else { Write-Host "  $McpHost         no answer yet (deploy mcp creates it)" }
    if ($w) {
        $h = Get-Code "https://$McpHost/healthz"
        $what = if ($h -eq 200) { 'the CAD server answers' } elseif ($h -eq 503) { 'starting, or no data in R2 yet (move cad)' } else { "HTTP $h" }
        Write-Host "  $McpHost/healthz $what"
    }
}

function Invoke-Check {
    Write-Title 'Tools on this computer'
    Assert-Tool 'git' 'Install Git for Windows from https://git-scm.com/download/win, then open a new PowerShell window.'
    Assert-Node
    Write-Host '  ok    git and Node.js' -ForegroundColor Green
    if (Test-Tool 'docker') {
        if (Test-Exit 'docker' @('info')) { Write-Host '  ok    Docker is running (deploy mcp builds the CAD image with it)' -ForegroundColor Green }
        else { Write-Host '  note  Docker is installed but not running: start Docker Desktop before deploy mcp' -ForegroundColor Yellow }
    } else { Write-Host '  note  Docker is not installed (needed for deploy mcp): https://docs.docker.com/desktop/setup/install/windows-install/' -ForegroundColor Yellow }
    if (Test-Tool 'fly') { Write-Host '  ok    flyctl (the data moves read Fly)' -ForegroundColor Green }
    else { Write-Host '  note  flyctl is not installed (needed for move tasks and move cad): iwr https://fly.io/install.ps1 -useb | iex' -ForegroundColor Yellow }

    Write-Title 'Folders'
    foreach ($r in @('CADOS', 'gocore-website')) {
        $d = Join-Path $Root $r
        if (Test-Path -LiteralPath (Join-Path $d '.git')) { Write-Host "  ok    $r ($(Get-Output 'git' @('log', '-1', '--format=%h %s', 'HEAD') $d))" -ForegroundColor Green }
        else { Write-Host "  FAIL  $r is not in $Root (.\bizomat.ps1 setup)" -ForegroundColor Red }
    }

    Write-Title 'Cloudflare'
    if (-not (Test-SignedIn)) { Stop-Here "wrangler is not signed in. Run: cd `"$(Get-SiteDir)`"; npx wrangler login. $AccountHint" }
    Write-Host '  ok    wrangler is signed in' -ForegroundColor Green
    $mcpDir = Join-Path (Join-Path $Root 'CADOS') 'cloudflare\mcp'
    if (Test-Path -LiteralPath (Join-Path $mcpDir 'package.json')) {
        if (Test-Exit 'node' @((Get-Wrangler $mcpDir), 'containers', 'list') $mcpDir) { Write-Host '  ok    Containers are available on this account' -ForegroundColor Green }
        else { Write-Host '  note  Containers did not answer: they need the Workers Paid plan (dashboard: Workers & Pages > Plans)' -ForegroundColor Yellow }
    }
    foreach ($name in $Workers.Keys) {
        if (Test-Worker $name) { Write-Host "  ok    Worker $name ($($Workers[$name])) exists" -ForegroundColor Green }
        else { Write-Host "  note  Worker $name ($($Workers[$name])) not deployed yet" -ForegroundColor Yellow }
    }
    foreach ($b in @($CadBucket, $TasksBucket)) {
        if (Test-Bucket $b) { Write-Host "  ok    R2 bucket $b exists" -ForegroundColor Green } else { Write-Host "  note  R2 bucket $b not made yet (the first deploy makes it)" -ForegroundColor Yellow }
    }
    if (Test-Database $TasksDb) { Write-Host "  ok    D1 database $TasksDb exists" -ForegroundColor Green } else { Write-Host "  note  D1 database $TasksDb not made yet (deploy tasks makes it)" -ForegroundColor Yellow }
    Show-Domain
    Show-Status
}

# ----------------------------------------------------------------------------- deploys

function Deploy-Mcp {
    Write-Title 'CAD Automation on Cloudflare: the Worker bizomat-mcp and its container'
    Assert-Node
    Assert-Tool 'docker' 'Install Docker Desktop: wrangler builds the CAD image with it.'
    if (-not (Test-Exit 'docker' @('info'))) { Stop-Here 'Docker is not running: start Docker Desktop, wait until it says it is running, then run this again.' }
    Assert-SignedIn
    $c = Get-DeployCommit 'CADOS'
    $dir = Join-Path $c.Dir 'cloudflare\mcp'
    if (-not (Test-Path -LiteralPath (Join-Path $dir 'wrangler.jsonc'))) { Stop-Here 'CADOS main has no cloudflare/mcp yet.' }
    Invoke-Step 'npm' @('ci', '--no-audit', '--no-fund') $dir
    if (-not $SkipChecks) { Invoke-Step 'npm' @('run', 'check') $dir }
    $w = Get-Wrangler $dir
    $first = -not (Test-Worker 'bizomat-mcp')
    Show-Commit $c
    Write-Host 'wrangler builds the image from CADOS''s Dockerfile (several minutes the first time) and sends it to Cloudflare.'
    if ($first) {
        Write-Host "First deploy: it also creates the R2 bucket $CadBucket and the address $McpHost (a new DNS record and"
        Write-Host 'its certificate; no record that exists today changes). Until CAD''s data is in R2 (move cad), every path but'
        Write-Host '/__worker/health answers 503: the server never starts without its accounts.'
    }
    if (-not (Confirm-Step 'Deploy bizomat-mcp now?')) { return }
    Invoke-Step 'node' @($w, 'deploy', '--var', "OPENSKETCH_VERSION:$($c.Short)", '--message', "$($c.Short) from $env:COMPUTERNAME") $dir

    Write-Title "Live checks ($McpHost)"
    $ok = Invoke-Checks @(
        @{ What = "https://$McpHost/__worker/health is $($c.Short) (a new address can take a few minutes)"; Test = { Wait-Until { (Get-Prop (Get-Json "https://$McpHost/__worker/health") 'version') -eq $c.Short } 600 } },
        @{ What = "https://$McpHost/healthz: the CAD server answers"; Info = $true; Test = { Wait-Until { (Get-Code "https://$McpHost/healthz") -eq 200 } 240 } }
    )
    Write-DeployLog 'mcp' $c $(if ($ok) { 'deployed' } else { 'deployed, checks failed' })
    if (-not $ok) { Stop-Here "A live check failed. The Worker's log: cd `"$dir`"; npx wrangler tail. The way back: npx wrangler rollback (there)." }
    Write-Host 'Next: secrets mcp (once), then move cad right before the switch (until then the server answers 503 here, by design).'
}

function Deploy-Tasks {
    Write-Title 'Project Management on Cloudflare: the Worker bizomat-tasks'
    Assert-Node
    Assert-SignedIn
    $c = Get-DeployCommit 'gocore-website'
    $dir = Join-Path $c.Dir 'apps\work'
    Invoke-Step 'npm' @('ci', '--no-audit', '--no-fund') $dir
    if ($SkipChecks) { Invoke-Step 'npm' @('run', 'build') $dir } else { Invoke-Step 'npm' @('run', 'check') $dir }
    $w = Get-Wrangler $dir
    $hasDb = Test-Database $TasksDb
    if ($hasDb) {
        $list = Get-Output 'node' @($w, 'd1', 'migrations', 'list', $TasksDb, '--remote', '--env', 'bizomat') $dir
        if ($null -eq $list) { Stop-Here "Could not read $TasksDb's migrations. $AccountHint" }
        $pending = -not ($list -match 'No migrations to apply')
        if ($pending -and -not $ApplyMigrations) { Stop-Here "$TasksDb has migrations waiting:`n$list`nRun again with -ApplyMigrations to apply them (a Time Travel point is shown first)." }
    } else {
        Write-Host "First deploy: it creates the D1 database $TasksDb, the R2 bucket $TasksBucket and a KV namespace. Its tables"
        Write-Host 'and data come with move tasks. bizomat-tasks has no address of its own: people reach it at bizomat.ai/tasks after the switch.'
    }
    Show-Commit $c
    if (-not (Confirm-Step 'Deploy bizomat-tasks now?')) { return }
    if ($hasDb -and $ApplyMigrations) {
        Invoke-Step 'node' @($w, 'd1', 'time-travel', 'info', $TasksDb, '--env', 'bizomat') $dir
        Invoke-Step 'node' @($w, 'd1', 'migrations', 'apply', $TasksDb, '--remote', '--env', 'bizomat') $dir
    }
    Invoke-Step 'node' @($w, 'deploy', '--env', 'bizomat', '--message', "$($c.Short) from $env:COMPUTERNAME") $dir
    $ok = Invoke-Checks @(@{ What = 'bizomat-tasks is deployed'; Test = { Test-Worker 'bizomat-tasks' } })
    Write-DeployLog 'tasks-cloudflare' $c $(if ($ok) { 'deployed' } else { 'deployed, checks failed' })
    if (-not $ok) { Stop-Here 'The Worker is not listed after the deploy.' }
    if (-not $hasDb) { Write-Host 'Next: move tasks (its tables and data).' }
}

function Deploy-Website {
    Write-Title 'The website on Cloudflare: the Worker bizomat'
    Assert-Node
    Assert-SignedIn
    foreach ($name in @('bizomat-mcp', 'bizomat-tasks')) {
        if (-not (Test-Worker $name)) { Stop-Here "The Worker $name is not deployed yet, and the website is bound to it: run deploy $(if ($name -eq 'bizomat-mcp') { 'mcp' } else { 'tasks' }) first." }
    }
    $c = Get-DeployCommit 'gocore-website'
    $dir = $c.Dir
    Invoke-Step 'npm' @('ci', '--no-audit', '--no-fund') $dir
    if ($SkipChecks) { Invoke-Step 'npm' @('run', 'build') $dir } else { Invoke-Step 'npm' @('run', 'verify') $dir }
    $changed = Get-Output 'git' @('status', '--porcelain') $dir
    if ($changed) { Stop-Here "The build changed files that are on GitHub, so this would not deploy what main holds:`n$changed" }
    $w = Get-Wrangler $dir
    Show-Commit $c
    Write-Host 'The Worker''s routes for bizomat.ai do nothing until the switch: bizomat.ai stays on Fly for now.'
    if (-not (Confirm-Step 'Deploy the website Worker bizomat now?')) { return }
    $env:BIZOMAT_DEPLOY = 'website'   # scripts/deploy-guard.mjs lets this tool's deploy through, and only from origin/main
    $saved = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'   # wrangler writes progress to stderr; Windows PowerShell 5.1 would stop on it
    $shown = @()
    try {
        Write-Host "> node wrangler deploy --message `"$($c.Short) from $env:COMPUTERNAME`"" -ForegroundColor DarkGray
        Push-Location -LiteralPath $dir
        try { & node $w deploy --message "$($c.Short) from $env:COMPUTERNAME" 2>&1 | ForEach-Object { "$_" } | Tee-Object -Variable shown | Out-Host; $code = $LASTEXITCODE } finally { Pop-Location }
    } finally { $ErrorActionPreference = $saved; Remove-Item Env:BIZOMAT_DEPLOY -ErrorAction SilentlyContinue }
    if ($code -ne 0) {
        if ("$shown" -match 'assigned to another worker') { Stop-Here 'Another Worker still holds the bizomat.ai routes. Remove them from it (Workers & Pages > that Worker > Settings > Domains & Routes), then run this again.' }
        Stop-Here "wrangler deploy failed (exit code $code)."
    }
    $preview = ([regex]::Match("$shown", 'https://bizomat\.[a-z0-9-]+\.workers\.dev')).Value

    Write-Title 'Live checks'
    $ok = Invoke-Checks @(
        @{ What = "the Worker answers at its workers.dev address ($preview)"; Test = { $preview -and (Wait-Until { (Get-Code "$preview/") -eq 200 } 120) } },
        @{ What = 'bizomat.ai is still Fly (until the switch)'; Info = $true; Test = { (Get-ServedBy 'https://bizomat.ai/') -eq 'Fly' } }
    )
    Write-DeployLog 'website-cloudflare' $c $(if ($ok) { 'deployed' } else { 'deployed, checks failed' })
    if (-not $ok) { Stop-Here "A live check failed. The way back: cd `"$dir`"; npx wrangler rollback." }
    Write-Host 'Next: secrets website, then the data moves and the switch.'
}

function Set-WebsiteSecrets {
    Write-Title 'The website''s secrets on the Worker bizomat'
    Assert-Node
    Assert-SignedIn
    if (-not (Test-Worker 'bizomat')) { Stop-Here 'The Worker bizomat is not deployed yet: run deploy website first.' }
    $site = Get-SiteDir
    $w = Get-Wrangler $site
    Write-Host 'Each value stays hidden while you type or paste it, and is sent straight to Cloudflare; it is not kept.'
    Write-Host 'Press Enter on an empty prompt to leave that secret as it is.'
    $names = [ordered]@{
        'TURNSTILE_SECRET_KEY'  = 'the contact and assessment forms (Turnstile, from the Cloudflare dashboard)'
        'STRIPE_WEBHOOK_SECRET' = 'optional: Stripe payment checks'
        'RESEND_API_KEY'        = 'optional: mail through Resend'
    }
    foreach ($name in $names.Keys) {
        $secure = Read-Host "$name ($($names[$name]))" -AsSecureString
        $value = (New-Object System.Net.NetworkCredential('', $secure)).Password.Trim()
        if (-not $value) { Write-Host "  $name left as it is"; continue }
        if ($DryRun) { $value = $null; Write-Host "  Dry run: $name not sent" -ForegroundColor Yellow; continue }
        Write-Host "> wrangler secret put $name (the value from the hidden prompt)" -ForegroundColor DarkGray
        $saved = $ErrorActionPreference
        $ErrorActionPreference = 'Continue'
        Push-Location -LiteralPath $site
        try { $value | & node $w secret put $name 2>&1 | Out-Null; $code = $LASTEXITCODE } finally { Pop-Location; $value = $null; $ErrorActionPreference = $saved }
        if ($code -ne 0) { Stop-Here "wrangler secret put $name failed (exit code $code)." }
        Write-Host "  ok    $name saved" -ForegroundColor Green
    }
}

function Set-McpSecrets {
    # The secrets a Fly server of CAD Automation may have (fly secrets list), copied to the Worker bizomat-mcp, so the
    # server on Cloudflare behaves the same with the same data folder (cloudflare/mcp/src/settings.ts FROM_FLY): the
    # seed of the owner's server-wide private address and of the link signatures, the key of the stored Google secret,
    # a Google sign-in set on the server. Each value goes from the Fly Machine to wrangler through a pipe: it is never
    # shown or written to a file.
    Write-Title "CAD Automation's secrets: from Fly ($CadApp) to the Worker bizomat-mcp"
    Assert-Tool 'fly' 'Install flyctl: iwr https://fly.io/install.ps1 -useb | iex  then: fly auth login'
    Assert-Node
    Assert-SignedIn
    if (-not (Test-Worker 'bizomat-mcp')) { Stop-Here 'Deploy bizomat-mcp first (deploy mcp).' }
    $c = Get-DeployCommit 'CADOS'
    $dir = Join-Path $c.Dir 'cloudflare\mcp'
    $w = Get-Wrangler $dir
    $wanted = @('OPENSKETCH_PASSWORD', 'OPENSKETCH_MCP_TOKEN', 'OPENSKETCH_KEY_SECRET', 'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET', 'OPENSKETCH_ACCESS_CODE', 'OPENSKETCH_INSTALLER_URL', 'OPENSKETCH_ADDIN_URL')
    $json = Get-Output 'fly' @('secrets', 'list', '--app', $CadApp, '--json')
    if (-not $json) { Stop-Here "Could not list the secrets of the Fly app $CadApp (fly auth login)." }
    $have = @()
    foreach ($s in @(ConvertFrom-Json -InputObject $json)) {
        $n = Get-Prop $s 'Name'
        if (-not $n) { $n = Get-Prop $s 'name' }
        if ($n) { $have += [string]$n }
    }
    $copy = @($wanted | Where-Object { $have -contains $_ })
    Write-Host "Secrets on $CadApp (names only): $(if ($have) { $have -join ', ' } else { 'none' })"
    if (-not $copy) {
        Write-Host 'None of them changes how the server works on Cloudflare: nothing to copy.' -ForegroundColor Green
        return
    }
    $group = $(if ($CadApp -eq 'bizomat') { 'cad' } else { 'app' })
    $list = Get-Output 'fly' @('machines', 'list', '--app', $CadApp, '--json')
    $machines = @()
    if ($list) {
        foreach ($m in @(ConvertFrom-Json -InputObject $list)) {
            $g = Get-Prop (Get-Prop (Get-Prop $m 'config') 'metadata') 'fly_process_group'
            if ((Get-Prop $m 'state') -eq 'started' -and (-not $g -or $g -eq $group)) { $machines += [string](Get-Prop $m 'id') }
        }
    }
    if ($machines.Count -ne 1) { Stop-Here "The Fly app $CadApp needs exactly one started Machine in the group $group (found $($machines.Count)). Start it: fly machine start -a $CadApp" }
    Write-Host "To copy to bizomat-mcp, read on the Machine $($machines[0]): $($copy -join ', ')"
    if (-not (Confirm-Step 'Copy them now?')) { return }
    foreach ($name in $copy) {
        $saved = $ErrorActionPreference
        $ErrorActionPreference = 'Continue'
        try {
            $value = (& fly ssh console --app $CadApp --machine $machines[0] --quiet --command "printenv $name" 2>$null | Out-String).Trim()
        } finally { $ErrorActionPreference = $saved }
        if (-not $value) {
            Stop-Here "$name is a secret of $CadApp but the Machine did not give its value. Set it by hand (hidden prompt): cd `"$dir`"; npx wrangler secret put $name"
        }
        Write-Host "> wrangler secret put $name (the value read on the Machine, not shown)" -ForegroundColor DarkGray
        $ErrorActionPreference = 'Continue'
        Push-Location -LiteralPath $dir
        try { $value | & node $w secret put $name 2>&1 | Out-Null; $code = $LASTEXITCODE } finally { Pop-Location; $value = $null; $ErrorActionPreference = $saved }
        if ($code -ne 0) { Stop-Here "wrangler secret put $name failed (exit code $code)." }
        Write-Host "  ok    $name copied" -ForegroundColor Green
    }
    Write-Host 'The container takes them at its next start: deploy mcp again, or wait until it sleeps (30 minutes idle).'
}

# ----------------------------------------------------------------------------- data

function Move-Tasks {
    Write-Title 'Project Management''s data: from Fly (bizomat, the work Machine) to D1 and R2'
    Assert-Tool 'fly' 'Install flyctl: iwr https://fly.io/install.ps1 -useb | iex  then: fly auth login'
    Assert-Node
    Assert-SignedIn
    $c = Get-DeployCommit 'gocore-website'
    $work = Join-Path $c.Dir 'apps\work'
    $tool = Join-Path $work 'scripts\migrate\to-cloudflare.mjs'
    if (-not (Test-Path -LiteralPath $tool)) { Stop-Here 'gocore-website main has no apps/work/scripts/migrate/to-cloudflare.mjs yet.' }
    if (-not (Test-Worker 'bizomat-tasks')) { Stop-Here 'Deploy bizomat-tasks first (deploy tasks): it creates the database and the bucket.' }
    Invoke-Step 'npm' @('ci', '--no-audit', '--no-fund') $work
    $machine = $null
    if ($Final) {
        $list = Get-Output 'fly' @('machines', 'list', '--app', 'bizomat', '--json')
        if (-not $list) { Stop-Here 'Could not list the Machines of the Fly app bizomat (fly auth login).' }
        $m = @((ConvertFrom-Json -InputObject $list) | ForEach-Object { $_ } | Where-Object { (Get-Prop (Get-Prop (Get-Prop $_ 'config') 'metadata') 'fly_process_group') -eq 'work' })
        if ($m.Count -ne 1) { Stop-Here "Expected one work Machine in the Fly app bizomat, found $($m.Count)." }
        $machine = Get-Prop $m[0] 'id'
        Write-Host "The final copy: the work Machine $machine goes into maintenance first, so nothing saved afterwards stays"
        Write-Host 'behind on Fly. People see a maintenance page at bizomat.ai/tasks until the switch. The way back: remove the'
        Write-Host "file and restart: fly ssh console -a bizomat --machine $machine -C `"rm /data/.bizomat-maintenance`"; fly machine restart $machine -a bizomat"
        if (-not (Confirm-Step 'Put Project Management on Fly in maintenance now?')) { return }
        Invoke-Step 'fly' @('ssh', 'console', '--app', 'bizomat', '--machine', $machine, '--command', 'touch /data/.bizomat-maintenance')
        Invoke-Step 'fly' @('machine', 'restart', $machine, '--app', 'bizomat')
    }
    $dir = Join-Path $Root ('moves\tasks-cloudflare-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
    Write-Host ''
    Write-Host "Working folder: $dir"
    Write-Host 'It holds a copy of Project Management''s data: keep it on this computer, delete it once bizomat.ai/tasks is checked.' -ForegroundColor Yellow
    Invoke-Step 'node' @('scripts/migrate/to-cloudflare.mjs', 'prepare', $dir, '--app', 'bizomat') $work
    Write-Host ''
    Write-Host "Next: load this copy into $TasksDb and $TasksBucket (it refuses a database that already has data)."
    if (-not (Confirm-Step 'Load the copy into Cloudflare now?')) { return }
    $apply = @('scripts/migrate/to-cloudflare.mjs', 'apply', $dir, '--db', $TasksDb, '--bucket', $TasksBucket)
    if ($Final -or $Replace) { $apply += '--replace' }   # over a rehearsal copy: a Time Travel point is recorded first
    Invoke-Step 'node' $apply $work
    Write-DeployLog $(if ($Final) { 'tasks-move-final' } else { 'tasks-move' }) $c 'applied'
    if ($Final) { Write-Host 'Project Management on Fly stays in maintenance. Next: move cad, then the switch.' }
    else { Write-Host 'A rehearsal copy is in. Right before the switch: move tasks -Final (it replaces this copy).' }
}

function Set-CadPaused([string] $Dir, [bool] $On) {
    # CAD_PAUSED is a secret of bizomat-mcp (cloudflare/mcp src/settings.ts isPaused): changing it needs no new image.
    $w = Get-Wrangler $Dir
    $saved = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    Push-Location -LiteralPath $Dir
    try {
        if ($On) {
            Write-Host '> wrangler secret put CAD_PAUSED (1)' -ForegroundColor DarkGray
            '1' | & node $w secret put CAD_PAUSED 2>&1 | Out-Host
        } else {
            Write-Host '> wrangler secret delete CAD_PAUSED' -ForegroundColor DarkGray
            '' | & node $w secret delete CAD_PAUSED 2>&1 | Out-Host
        }
        $code = $LASTEXITCODE
    } finally { Pop-Location; $ErrorActionPreference = $saved }
    if ($code -ne 0) { Stop-Here "wrangler secret $(if ($On) { 'put' } else { 'delete' }) CAD_PAUSED failed (exit code $code)." }
    $want = [bool]$On
    if (-not (Wait-Until { $h = Get-Json "https://$McpHost/__worker/health"; $h -and ([bool](Get-Prop $h 'paused') -eq $want) } 180)) {
        Stop-Here "bizomat-mcp does not show paused = $want after 3 minutes. Look at: cd `"$Dir`"; npx wrangler tail"
    }
}

function Move-Cad {
    Write-Title "CAD Automation's data folder: from Fly ($CadApp) to R2 ($CadBucket)"
    Assert-Tool 'fly' 'Install flyctl: iwr https://fly.io/install.ps1 -useb | iex  then: fly auth login'
    Assert-Node
    if ($Local -and $Replace) { Stop-Here '-Local and -Replace do not go together: a rehearsal goes into a new local folder.' }
    $c = Get-DeployCommit 'CADOS'
    $dir = Join-Path $c.Dir 'cloudflare\mcp'
    $tool = Join-Path $dir 'scripts\move-from-fly.mjs'
    if (-not (Test-Path -LiteralPath $tool)) { Stop-Here 'CADOS main has no cloudflare/mcp/scripts/move-from-fly.mjs yet.' }
    if (-not $Local) {
        Assert-SignedIn
        if (-not (Test-Worker 'bizomat-mcp')) { Stop-Here 'Deploy bizomat-mcp first (deploy mcp): it creates the bucket.' }
    }
    Invoke-Step 'npm' @('ci', '--no-audit', '--no-fund') $dir
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $folder = Join-Path $Root "moves\cad-cloudflare-$stamp"
    Write-Host ''
    Write-Host "Working folder: $folder"
    Write-Host 'It holds a copy of CAD Automation''s accounts, sign-ins and keys: keep it on this computer, and delete it once' -ForegroundColor Yellow
    Write-Host 'bizomat.ai/cad is checked after the switch.' -ForegroundColor Yellow
    if (-not $Local) { Write-Host 'Run this right before the switch: what changes on Fly after the copy (a sign-in, a new computer) stays on Fly.' }
    $prepare = @('scripts/move-from-fly.mjs', 'prepare', $folder, '--app', $CadApp)
    if ($CadApp -eq 'bizomat') { $prepare += @('--group', 'cad') }
    Invoke-Step 'node' $prepare $dir

    if ($Local) {
        $r2 = Join-Path $Root "moves\cad-local-r2-$stamp"
        Invoke-Step 'node' @('scripts/move-from-fly.mjs', 'apply', $folder, '--bucket', $CadBucket, '--local', $r2) $dir
        Write-Host ''
        Write-Host "Rehearsal done: the copy went into a local R2 folder ($r2) and read back whole. Nothing on Cloudflare or Fly changed." -ForegroundColor Green
        return
    }

    Write-Host ''
    if ($Replace) {
        Write-Host "Next: CAD Automation on Cloudflare is paused ($McpHost answers 503; the server is stopped and copies its last"
        Write-Host "changes to R2 first), what $CadBucket holds is kept in the working folder, this copy goes over it, and the"
        Write-Host 'pause is lifted: the server starts with this copy. bizomat.ai/cad is not affected while it is still on Fly.'
    } else {
        Write-Host "Next: upload the copy to $CadBucket (it refuses a bucket that already holds CAD data: then use -Replace). The"
        Write-Host 'container restores it on its next start; until the switch only mcp.bizomat.ai reaches it.'
    }
    if (-not (Confirm-Step 'Upload the copy to R2 now?')) { return }
    if ($Replace) {
        Set-CadPaused $dir $true
        Write-Host 'Paused. Waiting a minute for the server to copy its last changes to R2 and stop...'
        Start-Sleep -Seconds 60
    }
    $apply = @('scripts/move-from-fly.mjs', 'apply', $folder, '--bucket', $CadBucket)
    if ($Replace) { $apply += '--replace' }
    try {
        Invoke-Step 'node' $apply $dir
    } finally {
        if ($Replace) { Set-CadPaused $dir $false }
    }
    Write-DeployLog $(if ($Replace) { 'cad-move-cloudflare-replace' } else { 'cad-move-cloudflare' }) $c 'applied'
    Write-Title "Checks ($McpHost)"
    $ok = Invoke-Checks @(@{ What = "https://$McpHost/healthz: the CAD server starts with the data"; Test = { Wait-Until { (Get-Code "https://$McpHost/healthz") -eq 200 } 300 } })
    if (-not $ok) { Stop-Here "The server did not start with the data. The Worker's log: cd `"$dir`"; npx wrangler tail." }
    # Pages on mcp.bizomat.ai go to bizomat.ai/cad, which is Fly until the switch, so a browser cannot see this copy yet;
    # an AI app can, through the private address (Settings on bizomat.ai/cad), which the copy carries over.
    Write-Host ''
    Write-Host "Check the copy as an AI app does, before the switch: paste your private address (bizomat.ai/cad > Settings)."
    Write-Host 'It stays hidden, is used for this one check and is not kept. Press Enter to skip.'
    $secure = Read-Host 'Private address' -AsSecureString
    $addr = (New-Object System.Net.NetworkCredential('', $secure)).Password.Trim()
    if ($addr) {
        $path = ([uri]$addr).AbsolutePath -replace '^/cad/', '/'
        $addr = $null
        $n = 0
        try {
            $r = Invoke-WebRequest -UseBasicParsing -Method Post -Uri "https://$McpHost$path" -TimeoutSec 180 `
                -Body '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' -ContentType 'application/json' `
                -Headers @{ Accept = 'application/json, text/event-stream' }
            $n = ([regex]::Matches([string]$r.Content, '"inputSchema"')).Count
        } catch { $n = 0 }
        $path = $null
        if ($n -eq 31) { Write-Host "  ok    https://$McpHost answers your private address with the 31 tools: the copy has your account and keys" -ForegroundColor Green }
        else { Stop-Here "https://$McpHost did not answer your private address with the 31 tools ($n). The Worker's log: cd `"$dir`"; npx wrangler tail" }
    }
    Write-Host 'After the switch, sign in at https://bizomat.ai/cad and look at Admin, SOLIDWORKS and History.'
}

# ----------------------------------------------------------------------------- downloads

function Invoke-Wrangler([string] $Dir, [string[]] $Arguments) {
    # wrangler with its output shown; stops on failure. Runs with ErrorActionPreference Continue: wrangler writes
    # progress to stderr, which Windows PowerShell 5.1 would otherwise treat as an error.
    $w = Get-Wrangler $Dir
    $saved = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    Write-Host "> wrangler $($Arguments -join ' ')" -ForegroundColor DarkGray
    Push-Location -LiteralPath $Dir
    try { & node $w @Arguments 2>&1 | ForEach-Object { "$_" } | Out-Host; $code = $LASTEXITCODE } finally { Pop-Location; $ErrorActionPreference = $saved }
    if ($code -ne 0) { Stop-Here "wrangler $($Arguments -join ' ') failed (exit code $code)." }
}

function Publish-Installer {
    Write-Title "The SOLIDWORKS installer on bizomat.ai ($Downloads/)"
    Assert-Node
    if (-not $File) { Stop-Here 'Say which file: .\cloudflare.ps1 publish installer -File <path to BIZOMAT-CAD-Automation-<version>-x64.msi>' }
    $msi = (Resolve-Path -LiteralPath $File -ErrorAction SilentlyContinue)
    if (-not $msi) { Stop-Here "No file at $File." }
    $msi = $msi.Path
    if ([IO.Path]::GetExtension($msi) -ne '.msi') { Stop-Here 'That is not an .msi file.' }
    $v = $Version
    if (-not $v) {
        $m = [regex]::Match([IO.Path]::GetFileName($msi), '-(\d+\.\d+\.\d+)-x64\.msi$')
        if ($m.Success) { $v = $m.Groups[1].Value }
    }
    if ($v -notmatch '^\d+\.\d+\.\d+$') { Stop-Here 'The version is not in the file name: add -Version <x.y.z>.' }
    $item = Get-Item -LiteralPath $msi
    if ($item.Length -lt 1MB) { Stop-Here 'The file is under 1 MB: that is not the installer.' }
    $hash = (Get-FileHash -LiteralPath $msi -Algorithm SHA256).Hash.ToLower()
    $thumbs = @()
    if ($IsWin) {
        $sig = Get-AuthenticodeSignature -LiteralPath $msi
        if ($sig.Status -eq 'Valid') { $thumbs = @($sig.SignerCertificate.Thumbprint) }
    }
    $versioned = "BIZOMAT-CAD-Automation-$v-x64.msi"
    $names = @($versioned, 'BIZOMAT-CAD-Automation-x64.msi', 'CADOS-for-SOLIDWORKS-x64.msi')
    Write-Host "  file      $msi"
    Write-Host "  version   $v, $([math]::Round($item.Length / 1MB, 1)) MB, sha256 $hash"
    Write-Host "  signed    $(if ($thumbs.Count) { 'yes (' + $thumbs[0] + ')' } else { 'no (Companion updates need a signed installer; downloads work)' })"
    Write-Host "  goes to   $Downloads/$($names -join ', ') and their .sha256 files"
    $c = Get-DeployCommit 'CADOS'
    $dir = Join-Path $c.Dir 'cloudflare\mcp'
    $tmp = Join-Path ([IO.Path]::GetTempPath()) ('bizomat-publish-' + [guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path $tmp | Out-Null
    try {
        $release = [ordered]@{
            version = $v; msi_url = "$Downloads/$versioned"; sha256 = "sha256:$hash"; size = $item.Length
            signer_thumbprints = $thumbs; notes = "BIZOMAT CAD Automation for SOLIDWORKS $v"
            published_at = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
        }
        $releaseFile = Join-Path $tmp 'release.json'
        [IO.File]::WriteAllText($releaseFile, ($release | ConvertTo-Json), (New-Object Text.UTF8Encoding($false)))
        Write-Host ''
        Write-Host "Also: the release record, as $Downloads/release.json and as CAD Automation's bridge-release.json (in"
        Write-Host 'its data store), so its Download button and the Companions'' update check use this version from its next start.'
        if (-not (Confirm-Step 'Publish this installer now?')) { return }
        Assert-SignedIn
        $siteDir = Get-SiteDir
        if (-not (Test-Bucket $DownloadsBucket)) { Invoke-Wrangler $siteDir @('r2', 'bucket', 'create', $DownloadsBucket) }
        foreach ($n in $names) {
            Invoke-Wrangler $siteDir @('r2', 'object', 'put', "$DownloadsBucket/cad/$n", '--file', $msi, '--remote', '--content-type', 'application/x-msi')
            $sumFile = Join-Path $tmp "$n.sha256"
            [IO.File]::WriteAllText($sumFile, "$hash  $n`n", (New-Object Text.UTF8Encoding($false)))
            Invoke-Wrangler $siteDir @('r2', 'object', 'put', "$DownloadsBucket/cad/$n.sha256", '--file', $sumFile, '--remote', '--content-type', 'text/plain; charset=utf-8')
        }
        Invoke-Wrangler $siteDir @('r2', 'object', 'put', "$DownloadsBucket/cad/release.json", '--file', $releaseFile, '--remote', '--content-type', 'application/json')
        if (Test-Bucket $CadBucket) {
            Invoke-Wrangler $dir @('r2', 'object', 'put', "$CadBucket/data/bridge-release.json", '--file', $releaseFile, '--remote', '--content-type', 'application/octet-stream')
        } else { Write-Host "  note  $CadBucket does not exist yet: run this again after deploy mcp, for the Download button and updates" -ForegroundColor Yellow }

        Write-Title 'Checks (read back from R2)'
        $back = Join-Path $tmp 'back.msi'
        Invoke-Wrangler $siteDir @('r2', 'object', 'get', "$DownloadsBucket/cad/$versioned", '--file', $back, '--remote')
        $ok = Invoke-Checks @(
            @{ What = "$versioned read back whole (sha256)"; Test = { (Get-FileHash -LiteralPath $back -Algorithm SHA256).Hash.ToLower() -eq $hash } },
            @{ What = "$Downloads/$versioned answers (once the website Worker serves bizomat.ai)"; Info = $true; Test = { (Get-Code "$Downloads/$versioned") -eq 200 } }
        )
        Write-DeployLog 'installer-publish' $c $(if ($ok) { "published $v" } else { "published $v, checks failed" })
        if (-not $ok) { Stop-Here 'The copy in R2 does not match the file. Run this again.' }
        Write-Host "Published $v. CAD Automation reads the new release record at its next start (it sleeps after 30 minutes idle)."
    } finally { Remove-Item -LiteralPath $tmp -Recurse -Force -ErrorAction SilentlyContinue }
}

# ----------------------------------------------------------------------------- the switch

function Show-Switch {
    Write-Title 'The switch: bizomat.ai to Cloudflare'
    Write-Host 'Before, every one of these:'
    Assert-SignedIn
    $ready = Invoke-Checks @(
        @{ What = 'the Worker bizomat (the website) is deployed'; Test = { Test-Worker 'bizomat' } },
        @{ What = 'the Worker bizomat-tasks is deployed'; Test = { Test-Worker 'bizomat-tasks' } },
        @{ What = "https://$McpHost/healthz: CAD Automation answers with its data"; Test = { (Get-Code "https://$McpHost/healthz") -eq 200 } },
        @{ What = 'bizomat.ai is still Fly (not switched yet)'; Info = $true; Test = { (Get-ServedBy 'https://bizomat.ai/') -eq 'Fly' } }
    )
    Write-Host ''
    Write-Host 'Also done: move tasks -Final, then move cad, a few minutes before; secrets website; secrets mcp; publish installer'
    Write-Host '(the Download button sends people to bizomat.ai/downloads/cad/, as the GitHub releases are private).'
    Write-Host 'Every computer on CAD Automation 0.13 or later (it moves itself from cados.kevos.com, cados.fly.dev and'
    Write-Host 'cad.bizomat.ai to bizomat.ai/cad). An older Companion keeps talking to Fly and gets no commands after the switch.'
    Write-Host 'Outside Cloudflare, each listing these addresses (all on bizomat.ai, as on Fly today):'
    Write-Host '  Google Cloud, the CAD Automation sign-in client: https://bizomat.ai/cad/auth/google/callback'
    Write-Host '  Google Cloud, the Project Management sign-in client: https://bizomat.ai/tasks/api/auth/oauth/google/callback'
    Write-Host '  Stripe webhook (if used): https://bizomat.ai/api/assessment/stripe-webhook'
    Write-Host '  Turnstile widget hostnames: bizomat.ai and www.bizomat.ai'
    Write-Host '  AI apps: new connectors at https://mcp.bizomat.ai/mcp; those made at https://bizomat.ai/cad/mcp keep working'
    Write-Host ''
    Write-Host 'The switch itself is yours, in the Cloudflare dashboard (this script never changes DNS):' -ForegroundColor White
    Write-Host '  1. SSL/TLS > Overview for bizomat.ai: Full (strict).'
    Write-Host '  2. DNS > Records for bizomat.ai: the records named bizomat.ai (A and AAAA) and www: Proxy status to Proxied'
    Write-Host '     (orange cloud). Change nothing else (keep the MX and TXT records of info@bizomat.ai as they are).'
    Write-Host '  3. Within a minute bizomat.ai is the Worker bizomat; run: .\cloudflare.ps1 status'
    Write-Host '  4. Check, as after any production change: the website pages, sign-in at bizomat.ai/cad and bizomat.ai/tasks,'
    Write-Host '     the MCP connector, a paired computer (sw_status). Smoke test: node infrastructure/smoke/smoke.mjs (gocore-website).'
    Write-Host ''
    Write-Host 'The way back: the same records to DNS only (grey cloud). Fly answers again at once; for Project Management also' -ForegroundColor White
    Write-Host 'remove its maintenance file on Fly (the command move tasks -Final printed).'
    Write-Host 'Fly stays running and untouched either way; retiring it waits for your go-ahead.'
    if (-not $ready) { Write-Host ''; Write-Host 'Not ready yet: see the checks above.' -ForegroundColor Yellow }
}

# ----------------------------------------------------------------------------- main

switch ($Command) {
    'check' { Invoke-Check }
    'status' { Show-Status }
    'switch' { Show-Switch }
    'deploy' {
        switch ($App) {
            'mcp' { Deploy-Mcp }
            'tasks' { Deploy-Tasks }
            'website' { Deploy-Website }
            default { Stop-Here 'deploy what? mcp, tasks or website (in that order the first time).' }
        }
    }
    'secrets' { if ($App -eq 'website') { Set-WebsiteSecrets } elseif ($App -eq 'mcp') { Set-McpSecrets } else { Stop-Here 'secrets website or secrets mcp.' } }
    'publish' { if ($App -eq 'installer') { Publish-Installer } else { Stop-Here 'publish installer -File <msi> is the only one.' } }
    'move' {
        switch ($App) {
            'tasks' { Move-Tasks }
            'cad' { Move-Cad }
            default { Stop-Here 'move what? tasks or cad.' }
        }
    }
    default { Get-Help -Detailed $PSCommandPath | Out-String -Width 120 | Write-Host }
}
