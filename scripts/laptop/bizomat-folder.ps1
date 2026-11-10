<#
  BIZOMAT on D:\ : a fresh folder with both repositories, and everything worth keeping from D:\KEVOS SITE.

    .\bizomat-folder.ps1              Sets up D:\BIZOMAT and copies what GitHub does not have. Deletes nothing.
    .\bizomat-folder.ps1 -Fresh       The same, after emptying D:\BIZOMAT\from-KEVOS-SITE (the copies of an earlier run).
                                      Only while D:\KEVOS SITE is still whole.
    .\bizomat-folder.ps1 -DeleteOld   The same as the first, then moves D:\KEVOS SITE to the Recycle Bin, after you type
                                      a phrase. Refused while the report lists a problem.

  D:\BIZOMAT
    BIZOMAT-SITE           kevinjogin/bizomat-site, on the branch of the one-Machine work (it includes #7)
    BIZOMAT-CAD            kevinjogin/bizomat-cad, main
    backups                D:\KEVOS SITE\backups, copied and checked (not restore-test: unpack again when needed)
    from-KEVOS-SITE        what the two repositories on GitHub do not have, from D:\KEVOS SITE:
                           - per Git clone: all-branches.bundle (every branch, tag and stash, and older commits that
                             are on no branch any more; `git clone all-branches.bundle <folder>` opens it), a .patch per
                             stash, and files\ with every file that differs from the last commit (changed, staged, new)
                             and every ignored file that is not packages or build output (.env files, local settings).
                             A clone of bizomat-site or bizomat-cad with nothing unpushed gets no bundle: GitHub has it;
                           - per folder Git cannot read (a worktree whose repository is gone): whole-folder\, all of it
                             but what its own .gitignore ignores as packages or build output;
                           - every file outside the clones.
    KEVOS-SITE-report.txt  what was found and what was copied: names and counts, never file contents

  Every copy is checked with SHA-256. The script stops at the first error, before anything is deleted. Run it from a
  normal PowerShell window (not "Run as administrator"), outside D:\KEVOS SITE.
#>
param(
    [switch] $DeleteOld,
    [switch] $Fresh,
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
$DeleteMarker = Join-Path $New '.kevos-site-delete-started'
# Ignored folders that are packages or build output: made again by npm ci or a build, so not copied. Applied only to
# what a folder's own .gitignore ignores: a folder with one of these names that Git tracks or would track is copied.
$Rebuilt = '(^|/)(node_modules|dist|dist-server|\.astro|\.wrangler|\.cache|\.turbo|\.next|build|coverage|playwright-report|test-results|__pycache__|\.pytest_cache|\.venv|venv|bin|obj|pagefind|\.vs)(/|$)|\.pyc$'
# The two repositories GitHub holds today: a clone of one of them with nothing unpushed needs no copy of its history
$Live = 'github\.com[:/]kevinjogin/(bizomat-site|bizomat-cad)(\.git)?/?$'
$script:Copied = 0
$script:CopiedBytes = 0
$script:CloneSet = @{}
$script:EmptyRepo = $null
$script:IgnoredOk = $false
$Problems = New-Object System.Collections.Generic.List[string]
$Report = New-Object System.Collections.Generic.List[string]
function Say([string] $Text) { Write-Host $Text; $Report.Add($Text) }
function Problem([string] $Text) { $Problems.Add($Text); Say "    PROBLEM: $Text" }

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
function Key([string] $Path) { [IO.Path]::GetFullPath($Path).TrimEnd('\', '/').ToLowerInvariant() }
function Copy-Checked([string] $From, [string] $To) {
    [void][IO.Directory]::CreateDirectory((Split-Path -Parent $To))
    Copy-Item -LiteralPath $From -Destination $To -Force
    if ((Get-FileHash -LiteralPath $From -Algorithm SHA256).Hash -ne (Get-FileHash -LiteralPath $To -Algorithm SHA256).Hash) {
        throw "The copy of $From differs from the original. Nothing was deleted."
    }
    $script:Copied++
    $script:CopiedBytes += (Get-Item -LiteralPath $From -Force).Length
}
function Copy-Folder([string] $From, [string] $To, [hashtable] $Skip) {
    # A folder with everything in it (a .git inside it too: it is a repository this script did not list), except what
    # is in $Skip, the clones this script handles on their own, and links (never followed).
    $base = (Get-Item -LiteralPath $From -Force).FullName.TrimEnd('\', '/')
    $stack = New-Object System.Collections.Generic.Stack[string]
    $stack.Push($base)
    while ($stack.Count -gt 0) {
        $d = $stack.Pop()
        foreach ($item in Get-ChildItem -LiteralPath $d -Force) {
            $k = Key $item.FullName
            if ($Skip -and $Skip.ContainsKey($k)) { continue }
            if ($item.PSIsContainer) {
                if ($script:CloneSet.ContainsKey($k)) { continue }
                if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { continue }
                $stack.Push($item.FullName)
            } else { Copy-Checked $item.FullName (Join-Path $To (Rel $base $item.FullName)) }
        }
    }
}
function Get-IgnoredUnreadable([string] $Dir) {
    # What a folder's own .gitignore files ignore, asked through an empty repository of this script's own, for a folder
    # whose repository Git cannot read. $script:IgnoredOk says whether Git answered (an empty list is an answer).
    if (-not $script:EmptyRepo) {
        $tmp = Join-Path ([IO.Path]::GetTempPath()) ('bizomat-folder-' + [Guid]::NewGuid().ToString('N'))
        Run git @('init', '--quiet', $tmp)
        $script:EmptyRepo = $tmp
    }
    $ErrorActionPreference = 'Continue'
    $gitDir = Join-Path $script:EmptyRepo '.git'
    $all = @(& git -c 'safe.directory=*' -c 'core.quotepath=off' "--git-dir=$gitDir" "--work-tree=$Dir" ls-files --others --ignored --exclude-standard --directory 2>&1)
    $script:IgnoredOk = ($LASTEXITCODE -eq 0)
    if (-not $script:IgnoredOk) { return @() }
    return @($all | Where-Object { $_ -isnot [System.Management.Automation.ErrorRecord] } | ForEach-Object { "$_".TrimEnd('/') } | Where-Object { $_ -ne '' })
}
function Names([string[]] $List, [int] $Max = 25) {
    # the names when they are few, else how many there are in each folder
    if ($List.Count -le $Max) { return @($List | ForEach-Object { "      $_" }) }
    $groups = @($List | Group-Object { $p = $_ -split '/'; if ($p.Count -gt 2) { "$($p[0])/$($p[1])/" } elseif ($p.Count -gt 1) { "$($p[0])/" } else { '(top level)' } } | Sort-Object Count -Descending)
    $lines = @($groups | Select-Object -First 12 | ForEach-Object { "      $($_.Count) in $($_.Name)" })
    if ($groups.Count -gt 12) { $lines += "      and more in $($groups.Count - 12) other folders" }
    return $lines
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git is not installed: https://git-scm.com/download/win, then open a new PowerShell window.' }
if (("$New\").StartsWith("$Old\", [StringComparison]::OrdinalIgnoreCase)) { throw "$New must not be inside $Old." }
if ($Fresh) {
    # The copies are made again from D:\KEVOS SITE, so that must still be whole: never after a delete was started.
    if (-not (Test-Path -LiteralPath $Old)) { throw "$Old is not there any more: -Fresh would empty the only copy. Nothing was changed." }
    if (Test-Path -LiteralPath $DeleteMarker) { throw "A delete of $Old was started earlier: -Fresh would empty what may be the only copy. Nothing was changed." }
    if (Test-Path -LiteralPath $Keep) { Remove-Item -LiteralPath $Keep -Recurse -Force }
}

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
    foreach ($c in $clones) { $script:CloneSet[(Key $c)] = $true }
    $q = @('-c', 'core.quotepath=off')
    Say ''
    Say "Git clones in ${Old}: $($clones.Count)"
    try {
        foreach ($c in $clones) {
            $rel = Rel $Old $c
            $dest = Join-Path $Keep $rel
            $before = $script:Copied
            Say ''
            Say "  $rel"
            $why = ''
            try { [void](GitLines $c @('rev-parse', '--git-dir')) } catch { $why = $_.Exception.Message -replace ' Nothing was deleted\.$', '' }

            if ($why) {
                # Git cannot read it (a worktree whose repository is gone or moved, a half-made clone): keep all of it
                Say "    Git cannot read it: $why"
                $gitEntry = Join-Path $c '.git'
                if (Test-Path -LiteralPath $gitEntry -PathType Leaf) {
                    $line = "$(Get-Content -LiteralPath $gitEntry -TotalCount 1)"
                    if ($line -match '^gitdir:\s*(.+)$') {
                        $target = $Matches[1].Trim()
                        $main = $target -replace '[\\/]\.git[\\/]worktrees[\\/][^\\/]+[\\/]?$', ''
                        $probe = if ([IO.Path]::IsPathRooted($main)) { $main } else { Join-Path $c $main }
                        $there = if (Test-Path -LiteralPath $probe) { 'that folder exists' } else { 'that folder is gone' }
                        Say "    it was an extra working folder (worktree) of: $main ($there)"
                    }
                }
                $skip = @{}
                $ignored = @(Get-IgnoredUnreadable $c)
                if (-not $script:IgnoredOk) {
                    Say '    its .gitignore could not be read: everything is copied, packages and build output too'
                } else {
                    $left = @($ignored | Where-Object { $_ -match $Rebuilt })
                    foreach ($f in $left) { $skip[(Key (Join-Path $c $f))] = $true }
                    if ($left.Count -gt 0) { Say "    left out (its own .gitignore ignores them: packages and build output): $(($left | Select-Object -First 12) -join ', ')$(if ($left.Count -gt 12) { ' ...' })" }
                }
                Copy-Folder $c (Join-Path $dest 'whole-folder') $skip
                Say "    copied: the whole folder, its .git included, $($script:Copied - $before) file(s), to $(Rel $New (Join-Path $dest 'whole-folder'))"
                continue
            }

            $remote = (GitLines $c @('remote', 'get-url', 'origin') -AllowFail) -join ''
            $branch = (GitLines $c @('branch', '--show-current')) -join ''
            $hasCommits = [bool](GitLines $c @('rev-parse', '--verify', '--quiet', 'HEAD') -AllowFail)
            $isLive = [bool]($remote -match $Live)
            $unpushed = @(); $stashes = @(); $undo = 0
            if ($hasCommits) {
                # HEAD too: commits made without a branch (a detached HEAD) count
                $unpushed = @(GitLines $c @('log', '--format=%h %s', 'HEAD', '--branches', '--not', '--remotes'))
                $stashes = @(GitLines $c @('stash', 'list'))
                # commits only Git's undo log (reflog) still holds: amended, reset or rebased away, on no branch
                $undo = [int]((GitLines $c @('rev-list', '--count', '--reflog', '--not', '--all') -AllowFail) -join '')
            }
            # Every file that differs from the last commit: changed or staged (diff against HEAD), changed since staging,
            # and new; before the first commit, everything staged. Files deleted on purpose are known from Git.
            $changed = @(); $gone = @{}
            try {
                if ($hasCommits) {
                    $changed += GitLines $c ($q + @('diff', '--name-only', '--no-renames', 'HEAD'))
                    foreach ($g in (GitLines $c ($q + @('diff', '--name-only', '--no-renames', '--diff-filter=D', 'HEAD')))) { $gone[$g] = $true }
                } else {
                    $changed += GitLines $c ($q + @('ls-files', '--cached'))
                }
                $changed += GitLines $c ($q + @('ls-files', '--modified'))
                $changed += GitLines $c ($q + @('ls-files', '--others', '--exclude-standard'))
                foreach ($g in (GitLines $c ($q + @('ls-files', '--deleted')))) { $gone[$g] = $true }
            } catch { Problem "Git could not list the changed files of ${rel}: $($_.Exception.Message -replace ' Nothing was deleted\.$', '')" }
            $ignored = @(GitLines $c ($q + @('ls-files', '--others', '--ignored', '--exclude-standard', '--directory')) | ForEach-Object { $_.TrimEnd('/') })
            # a clone inside this clone is handled on its own
            $own = { -not $script:CloneSet.ContainsKey((Key (Join-Path $c $_))) }
            $changed = @($changed | ForEach-Object { $_.TrimEnd('/') } | Sort-Object -Unique | Where-Object $own)
            $kept = @($ignored | Where-Object { $_ -notmatch $Rebuilt } | Where-Object $own)

            Say "    GitHub: $(if ($remote) { $remote } else { 'none' }); branch: $(if ($branch) { $branch } else { '(none: detached)' })"
            Say "    not pushed: $($unpushed.Count) commit(s); stashes: $($stashes.Count); older commits on no branch: $undo; files that differ from the last commit: $($changed.Count); ignored files kept: $($kept.Count)"
            if ($unpushed.Count -gt 0) {
                Say '    commits GitHub does not have:'
                $unpushed | Select-Object -First 15 | ForEach-Object { Say "      $_" }
                if ($unpushed.Count -gt 15) { Say "      and $($unpushed.Count - 15) more" }
            }

            if ($hasCommits -and (-not $isLive -or $unpushed.Count -gt 0 -or $stashes.Count -gt 0 -or $undo -gt 0)) {
                [void][IO.Directory]::CreateDirectory($dest)
                $bundle = Join-Path $dest 'all-branches.bundle'
                $withUndo = $false
                if ($undo -gt 0) {
                    try { [void](GitLines $c @('bundle', 'create', $bundle, '--all', '--reflog')); $withUndo = $true } catch { $withUndo = $false }
                }
                if (-not $withUndo) { [void](GitLines $c @('bundle', 'create', $bundle, '--all')) }
                [void](GitLines $c @('bundle', 'verify', $bundle))
                $script:Copied++
                $script:CopiedBytes += (Get-Item -LiteralPath $bundle).Length
                $what = 'every branch, tag and stash'
                if ($withUndo) { $what += ", and the $undo older commit(s) on no branch" }
                elseif ($undo -gt 0) { $what += " (the $undo older commit(s) on no branch could not be added)" }
                Say "    saved: $what, in $(Rel $New $bundle) (git clone <bundle> <folder> opens it)"
            } elseif ($hasCommits) {
                Say '    its history is on GitHub (kevinjogin): no copy needed'
            }
            for ($i = 0; $i -lt $stashes.Count; $i++) {
                $patch = GitLines $c @('stash', 'show', '-p', '--include-untracked', "stash@{$i}") -AllowFail
                if (-not $patch) { $patch = GitLines $c @('stash', 'show', '-p', "stash@{$i}") -AllowFail }
                $p = Join-Path $dest "stash-$i.patch"
                [void][IO.Directory]::CreateDirectory($dest)
                Set-Content -LiteralPath $p -Value ($patch -join "`n") -Encoding UTF8
                Say "    saved: $($stashes[$i]) as $(Rel $New $p)"
            }

            $files = Join-Path $dest 'files'
            $missing = @()
            $beforeFiles = $script:Copied
            foreach ($f in $changed + $kept) {
                $src = Join-Path $c $f
                if (Test-Path -LiteralPath $src -PathType Container) { Copy-Folder $src (Join-Path $files $f) $null }
                elseif (Test-Path -LiteralPath $src) { Copy-Checked $src (Join-Path $files $f) }
                elseif (-not $gone.ContainsKey($f)) { $missing += $f }
            }
            if ($changed.Count -gt 0) { Say '    files that differ from the last commit (changed, staged or new):'; Names $changed | ForEach-Object { Say $_ } }
            if ($kept.Count -gt 0) { Say '    ignored files kept (not packages or build output):'; Names $kept 15 | ForEach-Object { Say $_ } }
            if ($script:Copied -gt $beforeFiles) { Say "    copied: $($script:Copied - $beforeFiles) file(s) to $(Rel $New $files)" }
            if ($missing.Count -gt 0) { Problem "$($missing.Count) file(s) of $rel that Git lists could not be read: $(($missing | Select-Object -First 10) -join ', ')" }
        }
    } finally {
        if ($script:EmptyRepo -and (Test-Path -LiteralPath $script:EmptyRepo)) { Remove-Item -LiteralPath $script:EmptyRepo -Recurse -Force -ErrorAction SilentlyContinue }
    }

    # every file outside the clones (links are not followed; backups\restore-test is a scratch unpack, not copied)
    $restoreTest = Key (Join-Path (Join-Path $Old 'backups') 'restore-test')
    $loose = New-Object System.Collections.Generic.List[string]
    $stack = New-Object System.Collections.Generic.Stack[string]
    $stack.Push($Old)
    while ($stack.Count -gt 0) {
        $d = $stack.Pop()
        foreach ($item in Get-ChildItem -LiteralPath $d -Force) {
            if ($item.PSIsContainer) {
                $k = Key $item.FullName
                if ($script:CloneSet.ContainsKey($k) -or $k -eq $restoreTest) { continue }
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
    if ($toKeep -gt 0) { Names @($loose | ForEach-Object { (Rel $Old $_) -replace '\\', '/' } | Where-Object { $_ -notmatch '^backups/' }) | ForEach-Object { Say $_ } }
}
Say ''
Say ("Copied and checked: {0} file(s), {1:N1} MB" -f $script:Copied, ($script:CopiedBytes / 1MB))
Say "Problems: $($Problems.Count)"
Set-Content -LiteralPath $ReportPath -Value $Report -Encoding UTF8
Write-Host "Report: $ReportPath"

# ------------------------------------------------------------------------------------------------ 3. delete (asked for)
if (-not $DeleteOld) {
    Write-Host ''
    Write-Host "Nothing was deleted. Read the report, then run again with -DeleteOld to move $Old to the Recycle Bin." -ForegroundColor Yellow
    return
}
if (-not (Test-Path -LiteralPath $Old)) { return }
if ($Problems.Count -gt 0) { throw "The report lists $($Problems.Count) problem(s): they are looked at first. Nothing was deleted." }
$onWindows = ($PSVersionTable.PSEdition -eq 'Desktop') -or $IsWindows
if (-not $onWindows) { throw 'Moving a folder to the Recycle Bin works on Windows only. Nothing was deleted.' }
$here = (Get-Location).ProviderPath.TrimEnd('\', '/')
if (("$here\").StartsWith("$Old\", [StringComparison]::OrdinalIgnoreCase)) { throw "This window is inside ${Old}: run cd $New first, and close editors and terminals open there. Nothing was deleted." }
Write-Host ''
Write-Host "Everything above is copied and checked. $Old goes to the Recycle Bin (restore it from there if needed;" -ForegroundColor Yellow
Write-Host "if Windows says it is too big for the Recycle Bin, choose No to keep it)." -ForegroundColor Yellow
$typed = Read-Host 'Type DELETE KEVOS SITE to continue (anything else stops)'
if ($typed -cne 'DELETE KEVOS SITE') { Write-Host 'Nothing deleted.'; return }
Set-Content -LiteralPath $DeleteMarker -Value "A delete of $Old was started on $(Get-Date -Format 'yyyy-MM-dd HH:mm'). -Fresh is refused from now on." -Encoding UTF8
Add-Type -AssemblyName Microsoft.VisualBasic
[Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory($Old, 'AllDialogs', 'SendToRecycleBin')
if (Test-Path -LiteralPath $Old) { Write-Host "Part of $Old is still there (a file in use, or you chose No). Close what uses it and run again." -ForegroundColor Yellow }
else { Write-Host "$Old is in the Recycle Bin." -ForegroundColor Green }
