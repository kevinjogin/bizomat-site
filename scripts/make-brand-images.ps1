# Generates the default social sharing card (public/og-default.png, 1200 x 630) using the cleaned
# GoCore wordmark. Run `node scripts/prepare-brand.mjs` first so brand-source/gocore-logo-clean.png exists.
# Windows only (System.Drawing). Run: powershell -ExecutionPolicy Bypass -File scripts/make-brand-images.ps1
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$public = Join-Path $root 'public'
$logoPath = Join-Path $root 'brand-source\gocore-logo-clean.png'

$paper = [System.Drawing.ColorTranslator]::FromHtml('#f6f5f1')
$ink = [System.Drawing.ColorTranslator]::FromHtml('#121211')
$muted = [System.Drawing.ColorTranslator]::FromHtml('#67645d')
$orange = [System.Drawing.ColorTranslator]::FromHtml('#ff6a13')
$blue = [System.Drawing.ColorTranslator]::FromHtml('#1456e8')
$line = [System.Drawing.Color]::FromArgb(38, 18, 18, 17)

function New-Font($names, $size, $style) {
  foreach ($n in $names) {
    $f = New-Object System.Drawing.Font($n, $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
    if ($f.Name -eq $n) { return $f }
  }
  return New-Object System.Drawing.Font('Arial', $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

$bmp = New-Object System.Drawing.Bitmap(1200, 630)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'; $g.TextRenderingHint = 'AntiAliasGridFit'; $g.InterpolationMode = 'HighQualityBicubic'; $g.PixelOffsetMode = 'HighQuality'
$g.Clear($paper)

# The "core" diagram, echoing the homepage.
$thin = New-Object System.Drawing.Pen($line, 1)
foreach ($r in 120, 190, 260, 330) { $g.DrawEllipse($thin, 980 - $r, 330 - $r, $r * 2, $r * 2) }
$g.DrawLine($thin, 980, 0, 980, 630); $g.DrawLine($thin, 650, 330, 1200, 330)
$g.DrawEllipse((New-Object System.Drawing.Pen($blue, 2)), 980 - 56, 330 - 56, 112, 112)
$g.FillEllipse((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 255, 106, 19))), 980 - 34, 330 - 34, 68, 68)
$g.FillEllipse((New-Object System.Drawing.SolidBrush($orange)), 980 - 18, 330 - 18, 36, 36)

# Wordmark
$logo = [System.Drawing.Image]::FromFile($logoPath)
$h = 92; $w = [int]($logo.Width * $h / $logo.Height)
$g.DrawImage($logo, 70, 78, $w, $h)
$logo.Dispose()

$display = @('Segoe UI Variable Display Semibold', 'Segoe UI Variable Display', 'Segoe UI Semibold', 'Arial')
$text = @('Segoe UI Variable Text', 'Segoe UI', 'Arial')
$head = New-Font $display 70 ([System.Drawing.FontStyle]::Regular)
$g.DrawString('Useful things, built', $head, (New-Object System.Drawing.SolidBrush($ink)), 66, 268)
$g.DrawString('from the core.', $head, (New-Object System.Drawing.SolidBrush($ink)), 66, 352)
$g.DrawString("gocore.com.au  $([char]0x00B7)  Australia", (New-Font $text 26 ([System.Drawing.FontStyle]::Regular)), (New-Object System.Drawing.SolidBrush($muted)), 72, 528)
$bmp.Save((Join-Path $public 'og-default.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Output 'Social card written to public/og-default.png'
