$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$distRoot = Join-Path $projectRoot 'dist'
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$archiveName = "renew404-dist-1panel-linux-$timestamp.zip"
$archivePath = Join-Path $projectRoot $archiveName

Set-Location -LiteralPath $projectRoot

foreach ($command in @('lint', 'test', 'build', 'e2e')) {
  & pnpm $command
  if ($LASTEXITCODE -ne 0) {
    throw "pnpm $command failed; no deployment archive was created."
  }
}

$workboxFiles = @(Get-ChildItem -LiteralPath $distRoot -Filter 'workbox-*.js' -File)
if ($workboxFiles.Count -ne 1) {
  throw "Expected exactly one root workbox-*.js file, found $($workboxFiles.Count)."
}

$orderedEntries = @(
  'assets',
  'icons',
  'fonts',
  'favicon.svg',
  'icon-maskable.svg',
  'icons.svg',
  $workboxFiles[0].Name,
  'manifest.webmanifest',
  'index.html',
  'sw.js'
)

& tar.exe -a -c -f $archivePath -C $distRoot @orderedEntries
if ($LASTEXITCODE -ne 0) {
  throw 'Could not create the 1Panel deployment archive.'
}

$archiveEntries = @(& tar.exe -tf $archivePath)
if ($LASTEXITCODE -ne 0) {
  throw 'Could not verify the 1Panel deployment archive.'
}

if ($archiveEntries | Where-Object { $_ -match '\\' }) {
  throw 'The archive contains Windows path separators and is unsafe for 1Panel.'
}

$indexPosition = [array]::IndexOf($archiveEntries, 'index.html')
$workerPosition = [array]::IndexOf($archiveEntries, 'sw.js')
if ($indexPosition -lt 0 -or $workerPosition -ne ($archiveEntries.Count - 1) -or $indexPosition -ge $workerPosition) {
  throw 'The archive release order is invalid: index.html and sw.js must be last.'
}

Write-Host "1Panel release ready: $archivePath"
