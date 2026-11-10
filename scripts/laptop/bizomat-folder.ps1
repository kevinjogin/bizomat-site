<#
  BIZOMAT on D:\ : a fresh folder with both repositories, and everything worth keeping from D:\KEVOS SITE.

    .\bizomat-folder.ps1              Sets up D:\BIZOMAT and copies what GitHub does not have. Deletes nothing.
    .\bizomat-folder.ps1 -DeleteOld   The same, then moves D:\KEVOS SITE to the Recycle Bin, after you type a phrase.

  D:\BIZOMAT
    BIZOMAT-SITE           kevinjogin/bizomat-site, on the branch of the one-Machine work (it includes #7)
    BIZOMAT-CAD            kevinjogin/bizomat-cad, main
    backups                D:\KEVOS SITE\backups, copied and checked (not restore-test: unpack again when needed)
    from-KEVOS-SITE        what GitHub does not have, from each Git clone in D:\KEVOS SITE: commits never pushed and
                           stashes (a .bundle with every branch, and a .patch per stash), changed and new files, and
                           ignored files that are not build output or packages (.env files, local settings); plus every
                           file in D:\KEVOS SITE outside a clone
    KEVOS-SITE-report.txt  what was found and what was copied (names and counts, never file contents)

  Every copy is checked with SHA-256. The script stops at the first error, before anything is deleted. Run it from a
  normal PowerShell window (not "Run as administrator"), outside D:\KEVOS SITE.
#>
param(
    [switch] $DeleteOld,
    [string] $New = 'D:\BIZOMAT',
    [string] $Old = 'D:\KEVOS SITE',
    [string] $SiteUrl = 'https://github.com/kevinjogin/bizomat-site.git',
    [string] $CadUrl = 'https://github.com/kevinjogin/bizomat-cad.git',
    [string] $SiteBranch = 'claude/compassionate-davinci-vjel6f'
)
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [Text.Encoding]::UTF8
$New = $New.TrimEnd('\', '/')
$Old = $Old.TrimEnd('\', '/')
$Keep = Join-Path $New 'from-KEVOS-SITE'
$Backups = Join-Path $New 'backups'
$ReportPath = Join-Path $New 'KEVOS-SITE-report.txt'
# Ignored folders that are build output or packages: rebuilt by npm ci or a build, so not copied
$Rebuilt = '(^|/)(node_modules|dist|dist-server|\.astro|\.wrangler|\.cache|\.turbo|\.next|build|coverage|playwright-report|test-results|__pycache__|\.pytest_cache|\.venv|venv|bin|obj|pagefind|\.vs)(/|$)|\.pyc$'
$script:Copied = 0
$script:CopiedBytes = 0
$Report = New-Object System.Collections.Generic.List[string]
function Say([string] $Text) { Write-Host $Text; $Report.Add($Text) }

function GitLines([string] $Dir, [string[]] $GitArgs, [switch] $AllowFail) {
    # git's output lines; stops the script when git fails (unless -AllowFail), with git's own message.
    # safe.directory=*: clones made by another Windows account (an administrator window, for example) are read too;
    # this script only reads them (and writes bundles outside them).
    $ErrorActionPreference = 'Continue'
    $all = @(& git -c 'safe.directory=*' -C $Dir @GitArgs 2>&1)
    $code = $LASTEXITCODE
    $out = @($all | Where-Object { $_ -isnot [System.Management.Automation.ErrorRecord] })
    if ($code -ne 0) {
        if ($AllowFail) { return @() }
        $msg = (@($all | Where-Object { $_ -is [System.Management.Automation.ErrorRecord] } | ForEach-Object { "$_" }) | Select-Object -First 2) -join ' '
        throw "git $($GitArgs -join ' ') failed in $Dir (exit $code): $msg. Nothing was deleted."
    }
    return @($out | ForEach-Object { "$_" } | Where-Object { $_ -ne '' })
}
function Run([string] $Exe, [string[]] $ExeArgs) {
    & $Exe @ExeArgs
    if ($LASTEXITCODE -ne 0) { throw "$Exe $($ExeArgs -join ' ') failed (exit $LASTEXITCODE). Nothing was deleted." }
}
function Rel([string] $Base, [string] $Full) { $Full.Substring($Base.Length).TrimStart('\', '/') }
function Copy-Checked([string] $From, [string] $To) {
    [void][IO.Directory]::CreateDirectory((Split-Path -Parent $To))
    Copy-Item -LiteralPath $From -Destination $To -Force
    if ((Get-FileHash -LiteralPath $From -Algorithm SHA256).Hash -ne (Get-FileHash -LiteralPath $To -Algorithm SHA256).Hash) {
        throw "The copy of $From differs from the original. Nothing was deleted."
    }
    $script:Copied++
    $script:CopiedBytes += (Get-Item -LiteralPath $From -Force).Length
}
function Copy-Whole([string] $From, [string] $To) {
    # a whole folder, .git included, without build output and packages ($Rebuilt); links are not followed
    $base = (Get-Item -LiteralPath $From -Force).FullName.TrimEnd('\', '/')
    $stack = New-Object System.Collections.Generic.Stack[string]
    $stack.Push($base)
    while ($stack.Count -gt 0) {
        $d = $stack.Pop()
        foreach ($item in Get-ChildItem -LiteralPath $d -Force) {
            $r = Rel $base $item.FullName
            if ($item.PSIsContainer) {
                if (($r -replace '\\', '/') -match $Rebuilt) { continue }
                if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { continue }
                $stack.Push($item.FullName)
            } else { Copy-Checked $item.FullName (Join-Path $To $r) }
        }
    }
}
function Copy-Tree([string] $From, [string] $To) {
    # a file, or a folder with everything in it (never another clone's .git)
    $item = Get-Item -LiteralPath $From -Force
    if (-not $item.PSIsContainer) { Copy-Checked $item.FullName $To; return }
    foreach ($f in Get-ChildItem -LiteralPath $item.FullName -Recurse -File -Force) {
        $r = Rel $item.FullName $f.FullName
        if ($r -match '(^|[\\/])\.git([\\/]|$)') { continue }
        Copy-Checked $f.FullName (Join-Path $To $r)
    }
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git is not installed: https://git-scm.com/download/win, then open a new PowerShell window.' }
if (("$New\").StartsWith("$Old\", [StringComparison]::OrdinalIgnoreCase)) { throw "$New must not be inside $Old." }

# ------------------------------------------------------------------------------------------------ 1. the two repositories
[void][IO.Directory]::CreateDirectory($New)
Say "BIZOMAT folder: $New ($(Get-Date -Format 'yyyy-MM-dd HH:mm'))"
foreach ($pair in @(@('BIZOMAT-SITE', $SiteUrl), @('BIZOMAT-CAD', $CadUrl))) {
    $dir = Join-Path $New $pair[0]
    if (Test-Path -LiteralPath (Join-Path $dir '.git')) {
        Say "$($pair[0]): already there, fetching GitHub's latest"
        Run git @('-C', $dir, 'config', 'core.autocrlf', 'false')
        Run git @('-C', $dir, 'fetch', '--prune', 'origin')
    } elseif (Test-Path -LiteralPath $dir) {
        throw "$dir exists but is not a Git clone: move it elsewhere first."
    } else {
        # core.autocrlf=false: files exactly as on GitHub (Windows line endings break the images' shell scripts)
        Run git @('clone', '--config', 'core.autocrlf=false', $pair[1], $dir)
        Say "$($pair[0]): cloned from $($pair[1])"
    }
}
$site = Join-Path $New 'BIZOMAT-SITE'
if (GitLines $site @('status', '--porcelain')) {
    Say "BIZOMAT-SITE has local changes: left on its branch $((GitLines $site @('branch', '--show-current')) -join '')"
} elseif (GitLines $site @('ls-remote', '--heads', 'origin', $SiteBranch) -AllowFail) {
    Run git @('-C', $site, 'switch', $SiteBranch)
    Run git @('-C', $site, 'pull', '--ff-only')
    Say "BIZOMAT-SITE: on $SiteBranch (the one-Machine work and #7; after its merge: git switch main, git pull)"
} else {
    Say "BIZOMAT-SITE: $SiteBranch is no longer on GitHub (merged?): staying on main"
    Run git @('-C', $site, 'pull', '--ff-only')
}

# ------------------------------------------------------------------------------------------------ 2. D:\KEVOS SITE
if (-not (Test-Path -LiteralPath $Old)) {
    Say "$Old is not there: nothing to copy."
} else {
    $Old = (Get-Item -LiteralPath $Old -Force).FullName.TrimEnd('\', '/')
    $clones = @(Get-ChildItem -LiteralPath $Old -Recurse -Force -Depth 5 -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -eq '.git' -and $_.FullName -notmatch '[\\/]node_modules[\\/]' } |
        ForEach-Object { if ($_.PSIsContainer) { $_.Parent.FullName } else { $_.DirectoryName } } |
        Sort-Object -Unique)
    Say ''
    Say "Git clones in ${Old}: $($clones.Count)"
    foreach ($c in $clones) {
        $rel = Rel $Old $c
        $dest = Join-Path $Keep $rel
        try {
            [void](GitLines $c @('rev-parse', '--git-dir'))
        } catch {
            # Git cannot read it (a broken or half-made clone, a worktree whose main folder is gone): keep all of it
            Say ''
            Say "  $rel"
            Say "    Git cannot read it: $($_.Exception.Message -replace ' Nothing was deleted\.$', '')"
            Copy-Whole $c (Join-Path $dest 'whole-folder')
            Say "    copied: the whole folder (its .git included, without build output and packages) to $(Rel $New (Join-Path $dest 'whole-folder'))"
            continue
        }
        $remote = (GitLines $c @('remote', 'get-url', 'origin') -AllowFail) -join ''
        $branch = (GitLines $c @('branch', '--show-current')) -join ''
        $hasCommits = [bool](GitLines $c @('rev-parse', '--verify', '--quiet', 'HEAD') -AllowFail)
        $unpushed = @(); $stashes = @()
        if ($hasCommits) {
            $unpushed = @(GitLines $c @('log', '--branches', '--not', '--remotes', '--oneline'))
            $stashes = @(GitLines $c @('stash', 'list'))
        }
        $changed = @(GitLines $c @('-c', 'core.quotepath=off', 'ls-files', '--modified', '--others', '--exclude-standard') | Sort-Object -Unique)
        $ignored = @(GitLines $c @('-c', 'core.quotepath=off', 'ls-files', '--others', '--ignored', '--exclude-standard', '--directory') |
            ForEach-Object { $_.TrimEnd('/') } | Where-Object { $_ -notmatch $Rebuilt })
        Say ''
        Say "  $rel"
        Say "    GitHub: $(if ($remote) { $remote } else { 'none' }); branch: $(if ($branch) { $branch } else { '(detached)' })"
        Say "    not pushed: $($unpushed.Count) commit(s); stashes: $($stashes.Count); changed or new files: $($changed.Count); ignored files kept: $($ignored.Count)"
        if ($unpushed.Count -gt 0 -or $stashes.Count -gt 0 -or -not $remote) {
            if ($hasCommits) {
                [void][IO.Directory]::CreateDirectory($dest)
                $bundle = Join-Path $dest 'all-branches.bundle'
                [void](GitLines $c @('bundle', 'create', $bundle, '--all'))
                [void](GitLines $c @('bundle', 'verify', $bundle))
                Say "    saved: every branch and the latest stash in $(Rel $New $bundle) (git clone <bundle> to read it)"
            }
            for ($i = 0; $i -lt $stashes.Count; $i++) {
                $patch = GitLines $c @('stash', 'show', '-p', '--include-untracked', "stash@{$i}") -AllowFail
                if (-not $patch) { $patch = GitLines $c @('stash', 'show', '-p', "stash@{$i}") -AllowFail }
                $p = Join-Path $dest "stash-$i.patch"
                [void][IO.Directory]::CreateDirectory($dest)
                Set-Content -LiteralPath $p -Value ($patch -join "`n") -Encoding UTF8
                Say "    saved: $($stashes[$i]) as $(Rel $New $p)"
            }
        }
        foreach ($f in $changed + $ignored) {
            $src = Join-Path $c $f
            if (Test-Path -LiteralPath $src) { Copy-Tree $src (Join-Path (Join-Path $dest 'files') $f) }
        }
        if ($changed.Count + $ignored.Count -gt 0) { Say "    copied: changed, new and kept ignored files to $(Rel $New (Join-Path $dest 'files'))" }
    }

    # every file outside the clones (links are not followed; backups\restore-test is a scratch unpack, not copied)
    $cloneSet = @{}
    foreach ($c in $clones) { $cloneSet[$c.ToLowerInvariant()] = $true }
    $restoreTest = (Join-Path (Join-Path $Old 'backups') 'restore-test').ToLowerInvariant()
    $loose = New-Object System.Collections.Generic.List[string]
    $stack = New-Object System.Collections.Generic.Stack[string]
    $stack.Push($Old)
    while ($stack.Count -gt 0) {
        $d = $stack.Pop()
        foreach ($item in Get-ChildItem -LiteralPath $d -Force) {
            if ($item.PSIsContainer) {
                $key = $item.FullName.TrimEnd('\', '/').ToLowerInvariant()
                if ($cloneSet.ContainsKey($key) -or $key -eq $restoreTest) { continue }
                if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { continue }
                $stack.Push($item.FullName)
            } else { $loose.Add($item.FullName) }
        }
    }
    $toBackups = 0; $toKeep = 0
    foreach ($f in $loose) {
        $rel = Rel $Old $f
        if ($rel -match '^backups[\\/]') { Copy-Checked $f (Join-Path $Backups ($rel -replace '^backups[\\/]', '')); $toBackups++ }
        else { Copy-Checked $f (Join-Path $Keep $rel); $toKeep++ }
    }
    Say ''
    Say "Files outside the clones: $toBackups to $(Rel $New $Backups), $toKeep to $(Rel $New $Keep)"
}
Say ''
Say ("Copied and checked: {0} file(s), {1:N1} MB" -f $script:Copied, ($script:CopiedBytes / 1MB))
Set-Content -LiteralPath $ReportPath -Value $Report -Encoding UTF8
Write-Host "Report: $ReportPath"

# ------------------------------------------------------------------------------------------------ 3. delete (asked for)
if (-not $DeleteOld) {
    Write-Host ''
    Write-Host "Nothing was deleted. Read the report, then run again with -DeleteOld to move $Old to the Recycle Bin." -ForegroundColor Yellow
    return
}
if (-not (Test-Path -LiteralPath $Old)) { return }
$onWindows = ($PSVersionTable.PSEdition -eq 'Desktop') -or $IsWindows
if (-not $onWindows) { throw 'Moving a folder to the Recycle Bin works on Windows only. Nothing was deleted.' }
$here = (Get-Location).ProviderPath.TrimEnd('\', '/')
if (("$here\").StartsWith("$Old\", [StringComparison]::OrdinalIgnoreCase)) { throw "This window is inside ${Old}: run cd $New first, and close editors and terminals open there. Nothing was deleted." }
Write-Host ''
Write-Host "Everything above is copied and checked. $Old goes to the Recycle Bin (restore it from there if needed;" -ForegroundColor Yellow
Write-Host "if Windows says it is too big for the Recycle Bin, choose No to keep it)." -ForegroundColor Yellow
$typed = Read-Host 'Type DELETE KEVOS SITE to continue (anything else stops)'
if ($typed -cne 'DELETE KEVOS SITE') { Write-Host 'Nothing deleted.'; return }
Add-Type -AssemblyName Microsoft.VisualBasic
[Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory($Old, 'AllDialogs', 'SendToRecycleBin')
if (Test-Path -LiteralPath $Old) { Write-Host "Part of $Old is still there (a file in use?). Close what uses it and run again." -ForegroundColor Yellow }
else { Write-Host "$Old is in the Recycle Bin." -ForegroundColor Green }
