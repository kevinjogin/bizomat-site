<#
.SYNOPSIS
  BIZOMAT from your own computer: one folder holding the three repositories, and every deploy made from it.

.DESCRIPTION
  Keep this file in the folder that holds everything (for example C:\BIZOMAT), then run:

    .\bizomat.ps1 setup            clone CADOS, gocore-website and PMO next to this file, or bring them up to date
    .\bizomat.ps1 status           each folder's state, GitHub's checks and what is live
    .\bizomat.ps1 deploy website   the BIZOMAT website: Fly app bizomat (the website and the router behind bizomat.ai)
    .\bizomat.ps1 deploy cad       CAD Automation: Fly app cados (bizomat.ai/cad)
    .\bizomat.ps1 deploy tasks     Project Management: Cloudflare Worker workos-platform-preview (work.kevos.com)
    .\bizomat.ps1 secrets website  the website's Workers AI access on Fly (the assistant and AI search): asks for
                                   the Cloudflare account ID and token, checks them, saves them on Fly
    .\bizomat.ps1 move tasks       Project Management's data from Cloudflare to the Fly app bizomat (bizomat.ai/tasks):
                                   exports and checks it (Cloudflare only read), then asks before it changes Fly
    .\bizomat.ps1 restore kevos    kevos.com back to the KEVOS site (Cloudflare), as it was before BIZOMAT went live
                                   there, and its routes back to kevos.com alone; asks before it changes anything

  secrets never shows the token or keeps it: it is typed at a hidden prompt, checked with Cloudflare and passed
  straight to Fly, so it is not on screen, in PowerShell's history or in a file.

  A deploy sends exactly what GitHub holds on the repository's main branch, never local edits. The folder must be
  on that branch, have no local changes and match GitHub; an old checkout once replaced the website (8 Oct 2026).
  The script runs the repository's own checks, shows what will go live, asks you to type yes, deploys,
  checks the live addresses and adds a line to deploy-log.csv. Add -DryRun to do everything but the deploy.

.PARAMETER DryRun
  Run every check and stop before deploying.

.PARAMETER SkipChecks
  Deploy without running the repository's checks (and, for cad, without passing GitHub checks). Not recommended.

.PARAMETER ApplyMigrations
  tasks only: apply waiting database migrations to the live database. Normally there are none.
#>
[CmdletBinding()]
param(
    [Parameter(Position = 0)] [ValidateSet('setup', 'status', 'deploy', 'secrets', 'move', 'restore', 'help')] [string] $Command = 'help',
    [Parameter(Position = 1)] [ValidateSet('website', 'cad', 'tasks', 'kevos')] [string] $App = '',
    [switch] $DryRun,
    [switch] $SkipChecks,
    [switch] $ApplyMigrations
)

Set-StrictMode -Version 2.0
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Root = $PSScriptRoot
$Owner = 'jogkev-creator'
$Repos = @('gocore-website', 'CADOS', 'PMO')
$IsWin = ($env:OS -eq 'Windows_NT')
$Curl = if ($IsWin) { 'curl.exe' } else { 'curl' }
$NullDevice = if ($IsWin) { 'NUL' } else { '/dev/null' }

# ----------------------------------------------------------------------------- helpers

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
    if (-not $v -or [version]$v -lt [version]'22.19.0') { Stop-Here "Node.js $v is too old: the website needs 22.19 or newer (https://nodejs.org)." }
}

function Get-Code {
    # The HTTP status of one request, without following redirects (0 when there is no answer).
    param([string] $Url, [string] $Method = 'GET', [string] $Json = '')
    $a = @('-s', '-o', $NullDevice, '-w', '%{http_code}', '-m', '30', '-A', 'bizomat-local', '-X', $Method)
    $tmp = $null
    if ($Json) {
        $tmp = [IO.Path]::GetTempFileName()
        [IO.File]::WriteAllText($tmp, $Json)
        $a += @('-H', 'Content-Type: application/json', '--data-binary', "@$tmp")
    }
    $code = Get-Output $Curl ($a + @($Url))
    if ($tmp) { Remove-Item -LiteralPath $tmp -ErrorAction SilentlyContinue }
    if ($code -match '^\d+$') { return [int]$code }
    return 0
}

function Get-Body([string] $Url) {
    $b = Get-Output $Curl @('-s', '-m', '30', '-A', 'bizomat-local', $Url)
    if ($b) { return $b }
    return ''
}

function Get-Title([string] $Url) {
    # The page's <title> after redirects, or what answered instead.
    $b = Get-Output $Curl @('-s', '-L', '-m', '30', '-A', 'bizomat-local', $Url)
    if ($b -and ($b -match '<title>([^<]*)</title>')) { return $Matches[1].Trim() }
    return 'no page'
}

function Get-Json([string] $Url) {
    try { return Invoke-RestMethod -UseBasicParsing -TimeoutSec 30 -Uri $Url -Headers @{ 'User-Agent' = 'bizomat-local' } }
    catch { return $null }
}

function Get-Checks {
    # GitHub's checks on one commit: passed, failed, running, none, or unknown (no answer, or a private repository).
    param([string] $Repo, [string] $Sha)
    try {
        $r = Invoke-RestMethod -UseBasicParsing -TimeoutSec 30 -Uri "https://api.github.com/repos/$Owner/$Repo/commits/$Sha/check-runs?per_page=100" `
            -Headers @{ 'User-Agent' = 'bizomat-local'; 'Accept' = 'application/vnd.github+json' }
    } catch { return 'unknown' }
    $runs = @($r.check_runs)
    if ($runs.Count -eq 0) { return 'none' }
    if (@($runs | Where-Object { $_.status -ne 'completed' }).Count -gt 0) { return 'running' }
    $bad = @('failure', 'timed_out', 'cancelled', 'action_required', 'startup_failure')
    if (@($runs | Where-Object { $bad -contains $_.conclusion }).Count -gt 0) { return 'failed' }
    return 'passed'
}

function Get-DefaultBranch([string] $Dir) {
    # The branch GitHub shows first (main; for PMO its default branch). Asked from GitHub each time.
    if (-not (Test-Exit 'git' @('remote', 'set-head', 'origin', '--auto') $Dir)) { Stop-Here "GitHub did not say which branch is $Dir's default." }
    $ref = Get-Output 'git' @('symbolic-ref', '--quiet', '--short', 'refs/remotes/origin/HEAD') $Dir
    if (-not $ref) { Stop-Here "Cannot tell the default branch of $Dir." }
    return ($ref -replace '^origin/', '')
}

function Get-DeployCommit([string] $Repo) {
    # The commit to deploy: the folder must be on the default branch, clean, and equal to GitHub (a folder that is
    # only behind is brought up to date; one with commits GitHub does not have is refused).
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
            Stop-Here "$Repo has commits that GitHub does not have. Put them on GitHub through a pull request first: a deploy only sends what GitHub holds."
        }
    }
    $subject = Get-Output 'git' @('log', '-1', '--format=%s', 'HEAD') $dir
    $when = Get-Output 'git' @('log', '-1', '--format=%cd', '--date=format:%Y-%m-%d %H:%M', 'HEAD') $dir
    return @{ Repo = $Repo; Dir = $dir; Branch = $branch; Commit = $head; Short = $head.Substring(0, 7); Subject = $subject; When = $when }
}

function Show-Commit($C) {
    Write-Host "Will deploy $($C.Repo) $($C.Branch) at $($C.Short) ($($C.When)): $($C.Subject)" -ForegroundColor White
}

function Confirm-Deploy([string] $What) {
    if ($DryRun) { Write-Host 'Dry run: every check is done; stopping before the deploy.' -ForegroundColor Yellow; return $false }
    Write-Host ''
    $typed = Read-Host "Deploy $What now? Type yes to deploy (anything else stops)"
    if ("$typed".Trim() -ne 'yes') { Write-Host 'Stopped. Nothing was deployed.'; exit 0 }
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

function Write-DeployLog([string] $App, $C, [string] $Result) {
    $who = $env:USERNAME
    if (-not $who) { $who = $env:USER }
    [pscustomobject]@{
        When = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss zzz'); App = $App; Repository = $C.Repo; Commit = $C.Short
        Subject = $C.Subject; Result = $Result; By = $who
    } | Export-Csv -LiteralPath (Join-Path $Root 'deploy-log.csv') -Append -NoTypeInformation -Encoding UTF8
}

# ----------------------------------------------------------------------------- setup and status

function Invoke-Setup {
    Write-Title "Setting up $Root"
    Assert-Tool 'git' 'Install Git for Windows from https://git-scm.com/download/win, then open a new PowerShell window.'
    Assert-Node
    if (-not (Test-Tool 'fly')) { Write-Host '  note  flyctl is not installed (needed for: deploy cad). Install: iwr https://fly.io/install.ps1 -useb | iex' -ForegroundColor Yellow }
    foreach ($r in $Repos) {
        $dir = Join-Path $Root $r
        if (Test-Path -LiteralPath (Join-Path $dir '.git')) {
            Write-Host "$r is here; fetching GitHub's latest."
            Invoke-Step 'git' @('config', 'core.autocrlf', 'false') $dir
            Invoke-Step 'git' @('fetch', '--prune', '--quiet', 'origin') $dir
        } elseif (Test-Path -LiteralPath $dir) {
            Stop-Here "$dir exists but is not a clone of $Owner/$r. Move it elsewhere first."
        } else {
            # core.autocrlf=false: files stay exactly as on GitHub (Windows line endings break the CAD image build)
            Invoke-Step 'git' @('clone', '--config', 'core.autocrlf=false', "https://github.com/$Owner/$r.git", $r) $Root
        }
    }
    foreach ($r in @('gocore-website', 'PMO')) { Invoke-Step 'npm' @('ci', '--no-audit', '--no-fund') (Join-Path $Root $r) }
    Write-Title 'Next, once on this computer'
    Write-Host '  1. Fly.io (for CAD Automation):     fly auth login'
    Write-Host "  2. Cloudflare (website and tasks):  cd `"$(Join-Path $Root 'gocore-website')`"; npx wrangler login"
    Write-Host '  3. Check:                           .\bizomat.ps1 status'
}

function Show-Status {
    Write-Title "Folders in $Root"
    foreach ($r in $Repos) {
        $dir = Join-Path $Root $r
        if (-not (Test-Path -LiteralPath (Join-Path $dir '.git'))) { Write-Host "  $r : not set up (run .\bizomat.ps1 setup)" -ForegroundColor Yellow; continue }
        [void](Test-Exit 'git' @('fetch', '--prune', '--quiet', 'origin') $dir)
        $branch = Get-DefaultBranch $dir
        $here = Get-Output 'git' @('rev-parse', '--abbrev-ref', 'HEAD') $dir
        $short = Get-Output 'git' @('rev-parse', '--short=7', 'HEAD') $dir
        $counts = (Get-Output 'git' @('rev-list', '--left-right', '--count', "HEAD...origin/$branch") $dir) -split '\s+'
        $dirty = if (Get-Output 'git' @('status', '--porcelain') $dir) { ', local changes' } else { '' }
        $remoteSha = Get-Output 'git' @('rev-parse', "origin/$branch") $dir
        $checks = Get-Checks $r $remoteSha
        Write-Host ("  {0,-15} on {1} at {2}; {3} ahead, {4} behind GitHub's {5}{6}; GitHub's checks there: {7}" -f $r, $here, $short, $counts[0], $counts[1], $branch, $dirty, $checks)
    }
    Write-Title 'Live'
    $cad = Get-Json 'https://cados.fly.dev/healthz'
    $cadVersion = if ($cad) { $cad.version } else { 'no answer' }
    $tasks = Get-Json 'https://work.kevos.com/api/health'
    $tasksState = if ($tasks) { "$($tasks.status), database $($tasks.db)" } else { 'no answer' }
    $site = Get-Title 'https://kevos.com/'
    $biz = Get-Title 'https://bizomat.ai/'
    Write-Host "  kevos.com          $site"
    Write-Host "  bizomat.ai         $biz"
    $router = Get-Json 'https://bizomat.fly.dev/__proxy/health'
    $routerState = if ($router) { "version $($router.version)" } else { 'not deployed yet' }
    Write-Host "  bizomat (Fly)      $routerState (bizomat.fly.dev/__proxy/health)"
    Write-Host "  CAD Automation     version $cadVersion (cados.fly.dev/healthz)"
    Write-Host "  Project Management $tasksState (work.kevos.com/api/health)"
}

# ----------------------------------------------------------------------------- deploys

function Test-WorkReady {
    # The router's view of Project Management: /__proxy/ready lists each backend's health.
    $b = Get-Body 'https://bizomat.fly.dev/__proxy/ready'
    try { return [bool](($b | ConvertFrom-Json).upstreams.work.ok) } catch { return $false }
}

function Deploy-Website {
    Write-Title 'BIZOMAT website: Fly app bizomat (the website and the router behind bizomat.ai)'
    Assert-Tool 'fly' 'Install flyctl: iwr https://fly.io/install.ps1 -useb | iex  then: fly auth login'
    Assert-Node
    $c = Get-DeployCommit 'gocore-website'
    Show-Commit $c
    if (-not (Test-Path -LiteralPath (Join-Path $c.Dir 'fly.website.toml'))) { Stop-Here 'gocore-website has no fly.website.toml yet: the website moves to Fly once that change is on GitHub.' }
    if (-not $SkipChecks) {
        Invoke-Step 'npm' @('ci', '--no-audit', '--no-fund') $c.Dir
        Invoke-Step 'npm' @('run', 'verify') $c.Dir                                       # the site: types, tests, build, page checks
        Invoke-Step 'node' @('--test', 'infrastructure/proxy/test/*.test.mjs') $c.Dir     # the router
    }
    $exists = Test-Exit 'fly' @('status', '--app', 'bizomat') $c.Dir
    if (-not $exists) {
        Write-Host ''
        Write-Host 'The Fly app bizomat does not exist yet. Creating it costs nothing until it runs.' -ForegroundColor Yellow
    }
    if (-not (Confirm-Deploy 'the BIZOMAT website to the Fly app bizomat')) { return }
    if (-not $exists) {
        Invoke-Step 'fly' @('apps', 'create', 'bizomat') $c.Dir
        Invoke-Step 'fly' @('ips', 'allocate-v6', '--app', 'bizomat') $c.Dir
        Invoke-Step 'fly' @('ips', 'allocate-v4', '--shared', '--app', 'bizomat') $c.Dir
    }
    # The volumes of Project Management (work_data) and CAD Automation (cad_data): fly deploy does not create one for
    # a group added to an existing app, and stops with "requires an unattached volume" when it is missing.
    $toml = Join-Path $c.Dir 'fly.website.toml'
    $needWork = Select-String -LiteralPath $toml -Pattern 'source\s*=\s*"work_data"' -Quiet
    $needCad = Select-String -LiteralPath $toml -Pattern 'source\s*=\s*"cad_data"' -Quiet
    if ($needWork -or $needCad) {
        $vols = Get-Output 'fly' @('volumes', 'list', '--app', 'bizomat', '--json') $c.Dir
        if ($needWork -and -not ("$vols" -match '"work_data"')) {
            Write-Host 'Creating the volume for Project Management''s data (3 GB in Sydney). If Fly asks whether to continue with one volume, answer y.' -ForegroundColor Yellow
            Invoke-Step 'fly' @('volumes', 'create', 'work_data', '--region', 'syd', '--size', '3', '--app', 'bizomat') $c.Dir
        }
        if ($needCad -and -not ("$vols" -match '"cad_data"')) {
            Write-Host 'Creating the volume for CAD Automation''s data (cad_data: 3 GB in Sydney, a snapshot every day kept 30 days).' -ForegroundColor Yellow
            Write-Host 'The cad Machine is a dedicated-CPU machine (performance-1x, 2 GB) and runs all the time once it exists.' -ForegroundColor Yellow
            Invoke-Step 'fly' @('volumes', 'create', 'cad_data', '--app', 'bizomat', '--region', 'syd', '--size', '3', '--snapshot-retention', '30', '--yes') $c.Dir
        }
    }
    # Built on Fly's machines; one Machine per group (router, website, Project Management); the commit as its version.
    Invoke-Step 'fly' @('deploy', '--config', 'fly.website.toml', '--app', 'bizomat', '--remote-only', '--ha=false', '--build-arg', "BIZOMAT_VERSION=$($c.Short)") $c.Dir
    # bizomat.ai points at this app; bizomat.fly.dev answers its own health endpoints and sends everything else to
    # bizomat.ai. A backend can need a moment after the router restarts, so those checks wait up to 90 s.
    Write-Title 'Live checks (bizomat.ai)'
    $want = $c.Short
    [void](Wait-Until { (Get-Json 'https://bizomat.fly.dev/__proxy/health').version -eq $want } 180)
    $checks = @(
        @{ What = "the router runs $want (bizomat.fly.dev/__proxy/health)"; Test = { (Get-Json 'https://bizomat.fly.dev/__proxy/health').version -eq $want } },
        @{ What = 'the website answers (bizomat.ai)'; Test = { Wait-Until { (Get-Title 'https://bizomat.ai/') -match 'BIZOMAT' } 90 } },
        @{ What = 'its APIs answer (/api/chat, no AI call made)'; Test = { Wait-Until { (Get-Code 'https://bizomat.ai/api/chat' 'POST' '{}') -eq 422 } 90 } },
        @{ What = 'CAD Automation is reached over the private network (/cad/)'; Test = { Wait-Until { (Get-Code 'https://bizomat.ai/cad/') -eq 200 } 90 } },
        @{ What = '/tasks/ answers (Project Management, or 302 to work.kevos.com before its switch)'; Test = { Wait-Until { $t = Get-Code 'https://bizomat.ai/tasks/'; ($t -eq 200) -or ($t -eq 302) } 90 } }
    )
    # Project Management on Fly, once fly.website.toml runs it (the work group)
    if (Select-String -LiteralPath (Join-Path $c.Dir 'fly.website.toml') -Pattern '^\s*work\s*=' -Quiet) {
        $checks += @{ What = 'Project Management runs on Fly (the router reports work healthy)'; Test = { Wait-Until { Test-WorkReady } 90 } }
    }
    $checks += @{ What = 'bizomat.ai/login goes to the sign-in page'; Info = $true; Test = { (Get-Code 'https://bizomat.ai/login') -eq 301 } }
    $checks += @{ What = 'bizomat.fly.dev sends people to bizomat.ai'; Info = $true; Test = { (Get-Code 'https://bizomat.fly.dev/') -eq 301 } }
    $ok = Invoke-Checks $checks
    $result = if ($ok) { 'ok' } else { 'deployed; live checks failed' }
    Write-DeployLog 'website' $c $result
    if (-not $ok) { Stop-Here 'A live check failed. Logs: fly logs -a bizomat. To go back: fly releases -a bizomat --image, then fly deploy --config fly.website.toml -a bizomat --image <the previous image>.' }
    Write-Host 'Done.' -ForegroundColor Green
}

function Deploy-Cad {
    Write-Title 'CAD Automation: Fly app cados (bizomat.ai/cad)'
    Assert-Tool 'fly' 'Install flyctl: iwr https://fly.io/install.ps1 -useb | iex  then: fly auth login'
    $c = Get-DeployCommit 'CADOS'
    Show-Commit $c
    $checks = Get-Checks 'CADOS' $c.Commit
    Write-Host "GitHub's checks on $($c.Short): $checks"
    if ($checks -ne 'passed' -and -not $SkipChecks) {
        Stop-Here "CAD Automation's tests run on GitHub (they need the CAD libraries and SOLIDWORKS stand-ins). Deploy once they pass."
    }
    if (-not (Confirm-Deploy 'CAD Automation (bizomat.ai/cad)')) { return }
    # The same command GitHub's deploy workflow uses: built on Fly's machines, one Machine, the commit as its version.
    Invoke-Step 'fly' @('deploy', '--app', 'cados', '--remote-only', '--ha=false', '--build-arg', "OPENSKETCH_VERSION=$($c.Short)", '--env', 'OPENSKETCH_PUBLIC_URL=https://bizomat.ai/cad') $c.Dir
    Write-Title 'Live checks'
    $want = $c.Short
    [void](Wait-Until { (Get-Json 'https://cados.fly.dev/healthz').version -eq $want } 180)
    $ok = Invoke-Checks @(
        @{ What = "the CAD app runs $want (cados.fly.dev/healthz)"; Test = { (Get-Json 'https://cados.fly.dev/healthz').version -eq $want } },
        @{ What = 'bizomat.ai/cad/ answers'; Test = { (Get-Code 'https://bizomat.ai/cad/') -eq 200 } },
        @{ What = 'the old address sends pages to bizomat.ai/cad (cados.kevos.com/docs: 301)'; Test = { (Get-Code 'https://cados.kevos.com/docs') -eq 301 } },
        @{ What = 'connectors made with cados.kevos.com keep their address'; Test = { (Get-Json 'https://cados.kevos.com/.well-known/oauth-protected-resource/mcp').resource -eq 'https://cados.kevos.com/mcp' } }
    )
    $result = if ($ok) { 'ok' } else { 'deployed; live checks failed' }
    Write-DeployLog 'cad' $c $result
    if (-not $ok) { Stop-Here "A live check failed. Logs: fly logs -a cados. To go back: fly releases -a cados --image, then fly deploy -a cados --image <the previous image>." }
    Write-Host 'Done.' -ForegroundColor Green
}

function Deploy-Tasks {
    Write-Title 'Project Management: Cloudflare Worker workos-platform-preview (work.kevos.com, bizomat.ai/tasks)'
    Assert-Node
    $c = Get-DeployCommit 'PMO'
    Show-Commit $c
    Write-Host "GitHub's checks on $($c.Short): $(Get-Checks 'PMO' $c.Commit)"
    if (-not $SkipChecks) {
        Invoke-Step 'npm' @('ci', '--no-audit', '--no-fund') $c.Dir
        Invoke-Step 'npm' @('run', 'check') $c.Dir   # lint, type check, tests in the Workers runtime, build
    }
    # The live database: migrations waiting to be applied (normally none). Never applied without -ApplyMigrations.
    $pending = Get-Output 'npx' @('wrangler', 'd1', 'migrations', 'list', 'DB', '--remote', '--env', 'preview') $c.Dir
    if ($null -eq $pending) { Stop-Here "Could not read the live database's migrations: not signed in (npx wrangler login), or more than one Cloudflare account (set `$env:CLOUDFLARE_ACCOUNT_ID). To see why: cd PMO; npx wrangler d1 migrations list DB --remote --env preview" }
    $waiting = $pending -notmatch 'No migrations to apply'
    if ($waiting) {
        Write-Host $pending
        if (-not $ApplyMigrations) { Stop-Here 'The live database has migrations waiting. Read them; to apply them, run again with -ApplyMigrations.' }
    }
    if (-not (Confirm-Deploy 'Project Management (work.kevos.com)')) { return }
    if ($waiting) {
        Write-Host 'Restore point of the live database before the migrations (keep the bookmark):'
        Invoke-Step 'npx' @('wrangler', 'd1', 'time-travel', 'info', 'workos-platform-preview-db', '--env', 'preview') $c.Dir
        Invoke-Step 'npx' @('wrangler', 'd1', 'migrations', 'apply', 'DB', '--remote', '--env', 'preview') $c.Dir
    }
    Invoke-Step 'npx' @('wrangler', 'deploy', '--env', 'preview', '--message', "$($c.Short) from $env:COMPUTERNAME") $c.Dir
    Write-Title 'Live checks'
    [void](Wait-Until { (Get-Json 'https://work.kevos.com/api/health').status -eq 'ok' } 120)
    Invoke-Step 'node' @('scripts/smoke.mjs', 'https://work.kevos.com') $c.Dir   # read-only: health, headers, sign-in enforcement
    $ok = Invoke-Checks @(
        @{ What = 'pages carry <base href> (this build serves both work.kevos.com and bizomat.ai/tasks)'; Test = { (Get-Body 'https://work.kevos.com/login') -match '<base href="/">' } },
        @{ What = 'bizomat.ai/tasks reaches Project Management'; Info = $true; Test = { (Get-Body 'https://bizomat.ai/tasks/login') -match '<base href="/tasks/">' } }
    )
    $result = if ($ok) { 'ok' } else { 'deployed; live checks failed' }
    Write-DeployLog 'tasks' $c $result
    if (-not $ok) { Stop-Here 'A live check failed. To go back: npx wrangler rollback --env preview (in the PMO folder).' }
    Write-Host 'Done.' -ForegroundColor Green
}

function Set-WebsiteSecrets {
    # CF_ACCOUNT_ID and CF_AI_TOKEN on the Fly app bizomat: the website's assistant and AI search use Workers AI with
    # them (without them, search runs on keywords). The token is never printed: not even in the command shown.
    Write-Title 'Workers AI for the BIZOMAT website (Fly app bizomat)'
    Assert-Tool 'fly' 'Install flyctl: iwr https://fly.io/install.ps1 -useb | iex  then: fly auth login'
    if (-not (Test-Exit 'fly' @('status', '--app', 'bizomat'))) { Stop-Here 'The Fly app bizomat does not exist yet: run .\bizomat.ps1 deploy website first.' }
    Write-Host 'The account ID is on the Cloudflare dashboard (Workers & Pages, right-hand side: Account ID).'
    $account = "$(Read-Host 'Cloudflare account ID')".Trim().ToLowerInvariant()
    # The website refuses to start with a malformed ID, so it is checked here, before Fly has it.
    if ($account -notmatch '^[0-9a-f]{32}$') { Stop-Here 'That is not an account ID (32 characters, 0-9 and a-f). Nothing was changed.' }
    $secure = Read-Host 'Workers AI token (what you type or paste stays hidden; then press Enter)' -AsSecureString
    $token = (New-Object System.Net.NetworkCredential('', $secure)).Password.Trim()
    if ($token -notmatch '^[A-Za-z0-9_.-]{20,}$') { Stop-Here 'That does not look like a Cloudflare API token. Nothing was changed.' }

    Write-Host 'Checking them with Cloudflare (reads the Workers AI model list; costs nothing)...'
    $status = 0
    try {
        $r = Invoke-RestMethod -UseBasicParsing -TimeoutSec 60 -Uri "https://api.cloudflare.com/client/v4/accounts/$account/ai/models/search?per_page=1" `
            -Headers @{ Authorization = "Bearer $token"; 'User-Agent' = 'bizomat-local' }
        if ($r.success) { $status = 200 }
    } catch {
        $p = $_.Exception.PSObject.Properties['Response']
        if ($p -and $p.Value) { try { $status = [int]$p.Value.StatusCode } catch { $status = 0 } }
    }
    if ($status -ne 200) {
        if ($status -in @(400, 401, 403, 404)) { Stop-Here "Cloudflare refused them (HTTP $status): check the account ID, and that the token was made with the Workers AI template for this account. Nothing was changed." }
        Stop-Here 'Could not reach Cloudflare to check the token. Nothing was changed; try again in a minute.'
    }
    Write-Host 'Cloudflare accepted them.' -ForegroundColor Green

    Write-Host ''
    Write-Host '> fly secrets set CF_ACCOUNT_ID=<the account ID> CF_AI_TOKEN=<hidden> --app bizomat' -ForegroundColor DarkGray
    & fly secrets set "CF_ACCOUNT_ID=$account" "CF_AI_TOKEN=$token" --app bizomat
    $code = $LASTEXITCODE
    $token = $null
    if ($code -ne 0) { Stop-Here "fly secrets set failed (exit code $code)." }

    Write-Title 'Live check (bizomat.fly.dev)'
    $ai = Wait-Until {
        try {
            $d = Invoke-RestMethod -UseBasicParsing -TimeoutSec 30 -Method Post -ContentType 'application/json' `
                -Uri 'https://bizomat.fly.dev/api/discover' -Headers @{ 'User-Agent' = 'bizomat-local' } -Body '{"question":"weld strength"}'
            return ($d.ok -and $d.ai)
        } catch { return $false }
    } 180
    if ($ai) { Write-Host 'The website uses Workers AI: its assistant and AI search are on.' -ForegroundColor Green }
    else { Write-Host 'Saved on Fly, but the website does not use AI yet. Look at: fly logs --app bizomat' -ForegroundColor Yellow }
}

function Move-Tasks {
    # Project Management's data from Cloudflare (D1 and R2) to the work Machine of the Fly app bizomat, with this
    # computer's wrangler and fly sign-ins. gocore-website's apps/work/scripts/migrate/to-fly.mjs does the work:
    # prepare only reads Cloudflare; apply, after you type yes, uploads, checks and puts the data in place on Fly.
    Write-Title 'Project Management to Fly: its data from Cloudflare to the Fly app bizomat (bizomat.ai/tasks)'
    Assert-Tool 'fly' 'Install flyctl: iwr https://fly.io/install.ps1 -useb | iex  then: fly auth login'
    Assert-Node
    $c = Get-DeployCommit 'gocore-website'
    Show-Commit $c
    $work = Join-Path $c.Dir 'apps\work'
    if (-not (Test-Path -LiteralPath (Join-Path $work 'scripts\migrate\to-fly.mjs'))) { Stop-Here 'gocore-website has no move tool yet (apps/work/scripts/migrate/to-fly.mjs): it comes with the Project Management on Fly change.' }
    if (-not (Test-Exit 'fly' @('status', '--app', 'bizomat'))) { Stop-Here 'The Fly app bizomat does not exist yet: run .\bizomat.ps1 deploy website first.' }
    Invoke-Step 'npm' @('ci', '--no-audit', '--no-fund') $work     # wrangler and the move's packages
    $dir = Join-Path $Root ('moves\tasks-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
    Write-Host ''
    Write-Host "Working folder: $dir"
    Write-Host 'It holds a copy of Project Management''s data: keep it on this computer, delete it once bizomat.ai/tasks is checked.' -ForegroundColor Yellow
    Write-Host 'If wrangler says it sees more than one Cloudflare account: $env:CLOUDFLARE_ACCOUNT_ID = ''<the account ID>'', then run this again.'
    Invoke-Step 'node' @('scripts/migrate/to-fly.mjs', 'prepare', $dir) $work
    if ($DryRun) { Write-Host 'Dry run: the copy is prepared and checked; nothing on Fly changed.' -ForegroundColor Yellow; return }
    Write-Host ''
    Write-Host 'Next: upload this copy and replace the data of Project Management on Fly with it (what is there now is kept in /data/backups).'
    Write-Host 'work.kevos.com is not changed, and bizomat.ai/tasks still sends people there until the switch.'
    $typed = Read-Host 'Put this copy on Fly now? Type yes to continue (anything else stops)'
    if ("$typed".Trim() -ne 'yes') { Write-Host 'Stopped. Nothing on Fly changed.'; return }
    Invoke-Step 'node' @('scripts/migrate/to-fly.mjs', 'apply', $dir) $work
    Write-DeployLog 'tasks-move' $c 'applied'
    Write-Title 'Next'
    Write-Host '1. Open https://bizomat.fly.dev/__preview/work, sign in with your own email and password, and compare a board,'
    Write-Host '   a document and a file with work.kevos.com. Until the switch, leave work.kevos.com unchanged.'
    Write-Host '2. https://bizomat.fly.dev/__preview/clear takes that browser back to the website.'
    Write-Host '3. Then the switch: bizomat.ai/tasks serves Project Management from Fly.'
}

# ----------------------------------------------------------------------------- kevos.com

function Get-Prop($Obj, [string] $Name) {
    # A property of an object read from JSON, or $null when it has none (strict mode refuses a missing one).
    if ($null -eq $Obj) { return $null }
    $p = $Obj.PSObject.Properties[$Name]
    if ($p) { return $p.Value }
    return $null
}

function ConvertTo-Utc($Value) {
    # A JSON time in UTC, or $null when it is not one. PowerShell 7 reads it as a DateTime already; Windows PowerShell
    # 5.1 leaves the text, which Cloudflare may write with up to 9 decimals of a second (.NET reads at most 7).
    if ($Value -is [datetime]) {
        if ($Value.Kind -eq [DateTimeKind]::Unspecified) { return [datetime]::SpecifyKind($Value, [DateTimeKind]::Utc) }
        return $Value.ToUniversalTime()
    }
    $text = ("$Value".Trim()) -replace '(\.\d{7})\d+', '$1'
    $when = [datetimeoffset]::MinValue
    $styles = [Globalization.DateTimeStyles]::AssumeUniversal
    if ($text -and [datetimeoffset]::TryParse($text, [Globalization.CultureInfo]::InvariantCulture, $styles, [ref]$when)) { return $when.UtcDateTime }
    return $null
}

function ConvertFrom-JsonList([string] $Text) {
    # The items of the first JSON list in a program's output. Windows PowerShell 5.1's ConvertFrom-Json hands a list
    # on as one object (PowerShell 7 hands on its items), so the list is unrolled here: the same answer in both.
    $m = [regex]::Match("$Text", '(?s)\[\s*(?:\{.*\})?\s*\]')
    if (-not $m.Success) { return $null }
    try { $json = ConvertFrom-Json -InputObject $m.Value } catch { return $null }
    return ,@($json | ForEach-Object { $_ })
}

function Restore-Kevos {
    # Stage 0 (owner's decision, 6 Nov 2026): kevos.com shows the KEVOS site again. The Cloudflare Worker behind it,
    # throbbing-block-6c61, goes back to the deployment that was live before the BIZOMAT website was published there
    # (gocore-website 33a77cb, 6 Nov 2026 01:03 UTC): the KEVOS site built from c79e297 (5 Nov). Then its routes become
    # kevos.com/* alone: bizomat.ai/* and www.bizomat.ai/* belong to the Fly app bizomat now. With this computer's
    # wrangler sign-in; nothing changes before you type yes, and the way back is shown first.
    Write-Title 'kevos.com: back to the KEVOS site (Cloudflare Worker throbbing-block-6c61)'
    Assert-Node
    $worker = 'throbbing-block-6c61'
    $published = [datetime]::SpecifyKind([datetime]'2026-11-06T01:03:28', [DateTimeKind]::Utc)
    $site = Join-Path $Root 'gocore-website'
    $wrangler = Join-Path (Join-Path (Join-Path (Join-Path $site 'node_modules') 'wrangler') 'bin') 'wrangler.js'
    if (-not (Test-Path -LiteralPath $wrangler)) { Stop-Here 'wrangler is not in the gocore-website folder: run .\bizomat.ps1 setup first.' }

    # wrangler runs in a folder of its own, with the Worker's name and route only: no other setting is read or sent
    $work = Join-Path ([IO.Path]::GetTempPath()) ('bizomat-kevos-' + [guid]::NewGuid().ToString('N').Substring(0, 8))
    [void](New-Item -ItemType Directory -Path $work)
    $config = Join-Path $work 'wrangler.toml'
    $lines = @(
        '# kevos.com alone (bizomat.ps1 restore kevos)',
        "name = `"$worker`"",
        'compatibility_date = "2025-09-01"',
        'workers_dev = false',
        'routes = [ { pattern = "kevos.com/*", zone_name = "kevos.com" } ]'
    )
    [IO.File]::WriteAllText($config, (($lines -join "`n") + "`n"))
    try {
        Write-Host 'Reading the Worker''s last 10 deployments (wrangler deployments list)...'
        $raw = Get-Output 'node' @($wrangler, 'deployments', 'list', '--name', $worker, '--json', '--config', $config) $work
        $deployments = $null
        if ($raw) { $deployments = ConvertFrom-JsonList $raw }
        if ($null -eq $deployments) {
            Stop-Here "wrangler could not list the Worker's deployments: not signed in (cd `"$site`"; npx wrangler login), or more than one Cloudflare account (`$env:CLOUDFLARE_ACCOUNT_ID = '<the account ID>', then run this again)."
        }
        # each deployment: when it was made and the versions it serves; any we cannot read stops everything
        $list = @(foreach ($d in $deployments) {
            $when = ConvertTo-Utc (Get-Prop $d 'created_on')
            if ($null -eq $when) { Stop-Here "wrangler's list of deployments was not understood (a deployment without a time: '$(Get-Prop $d 'created_on')'). Nothing was changed." }
            [pscustomobject]@{ When = $when; Versions = @(Get-Prop $d 'versions') }
        })
        $sorted = @($list | Sort-Object When)
        if ($sorted.Count -eq 0) { Stop-Here 'The Worker has no deployments. Nothing was changed.' }
        $live = $sorted[-1]
        $before = @($sorted | Where-Object { $_.When -lt $published })
        if ($before.Count -eq 0) {
            Stop-Here "The deployment from before 6 Nov 2026 01:03 UTC is not among the last 10. Nothing was changed. In the Cloudflare dashboard: Workers & Pages > $worker > Deployments: deploy the version of 5 Nov 2026 (the KEVOS site, c79e297)."
        }
        $target = $before[-1]
        $targetVersions = @($target.Versions)
        $liveVersions = @($live.Versions)
        if ($targetVersions.Count -ne 1) { Stop-Here "That deployment splits traffic between versions: deploy it from the dashboard (Workers & Pages > $worker > Deployments). Nothing was changed." }
        $want = "$(Get-Prop $targetVersions[0] 'version_id')"
        $now = ''
        if ($liveVersions.Count -eq 1) { $now = "$(Get-Prop $liveVersions[0] 'version_id')" }
        if ($want -notmatch '^[0-9a-f-]{36}$') { Stop-Here 'wrangler did not give a version ID for that deployment. Nothing was changed.' }
        Write-Host ''
        Write-Host ("  live now          deployment of {0:yyyy-MM-dd HH:mm} UTC, version {1}" -f $live.When, $(if ($now) { $now } else { '(several)' }))
        Write-Host ("  the KEVOS site    deployment of {0:yyyy-MM-dd HH:mm} UTC, version {1}" -f $target.When, $want)
        Write-Host "  kevos.com shows   $(Get-Title 'https://kevos.com/')"

        if ($now -eq $want) {
            Write-Host 'kevos.com already runs the KEVOS version; only its routes are set.' -ForegroundColor Green
            if ($DryRun) { Write-Host 'Dry run: stopping before the routes.' -ForegroundColor Yellow; return }
        } else {
            if ($DryRun) { Write-Host 'Dry run: every check is done; stopping before the change.' -ForegroundColor Yellow; return }
            if ($now) { Write-Host "The way back, if ever needed: node `"$wrangler`" rollback $now --name $worker" -ForegroundColor DarkGray }
            Write-Host ''
            $typed = Read-Host 'Put the KEVOS site back on kevos.com now? Type yes to continue (anything else stops)'
            if ("$typed".Trim() -ne 'yes') { Write-Host 'Stopped. Nothing was changed.'; return }
            Invoke-Step 'node' @($wrangler, 'rollback', $want, '--name', $worker, '--config', $config, '--yes', '--message', 'Stage 0: the KEVOS site again (built from c79e297); BIZOMAT is on Fly') $work
        }

        # The routes: kevos.com/* alone. wrangler replaces the Worker's whole list with this one.
        Invoke-Step 'node' @($wrangler, 'triggers', 'deploy', '--name', $worker, '--config', $config) $work

        Write-Title 'Live checks'
        $ok = Invoke-Checks @(
            @{ What = 'kevos.com shows the KEVOS site'; Test = { Wait-Until { $t = Get-Title 'https://kevos.com/'; ($t -match 'KEVOS') -and ($t -notmatch 'BIZOMAT') } 120 } },
            @{ What = 'bizomat.ai shows the BIZOMAT website (Fly)'; Test = { (Get-Title 'https://bizomat.ai/') -match 'BIZOMAT' } }
        )
        $result = if ($ok) { 'ok' } else { 'restored; live checks failed' }
        Write-DeployLog 'kevos' @{ Repo = 'gocore-website'; Short = 'c79e297'; Subject = "kevos.com: the KEVOS site again (version $want)" } $result
        if (-not $ok) { Stop-Here "A live check failed. kevos.com shows: $(Get-Title 'https://kevos.com/'). Look at Workers & Pages > $worker > Deployments in the Cloudflare dashboard." }
        Write-Host 'Done: kevos.com is the KEVOS site again.' -ForegroundColor Green
        Write-Title 'One click left, in the Cloudflare dashboard'
        Write-Host "  Workers & Pages > $worker > Settings > Build > Disconnect."
        Write-Host '  Then nothing on GitHub can publish to kevos.com again. Until then, gocore-website stops such a build before it deploys.'
    } finally {
        Remove-Item -LiteralPath $work -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# ----------------------------------------------------------------------------- main

switch ($Command) {
    'setup' { Invoke-Setup }
    'status' { Show-Status }
    'deploy' {
        switch ($App) {
            'website' { Deploy-Website }
            'cad' { Deploy-Cad }
            'tasks' { Deploy-Tasks }
            default { Stop-Here 'Say which: .\bizomat.ps1 deploy website | cad | tasks' }
        }
    }
    'secrets' {
        if ($App -eq 'website') { Set-WebsiteSecrets } else { Stop-Here 'Say which: .\bizomat.ps1 secrets website' }
    }
    'move' {
        if ($App -eq 'tasks') { Move-Tasks } else { Stop-Here 'Say which: .\bizomat.ps1 move tasks' }
    }
    'restore' {
        if ($App -eq 'kevos') { Restore-Kevos } else { Stop-Here 'Say which: .\bizomat.ps1 restore kevos' }
    }
    default { Get-Help -Detailed $PSCommandPath }
}
