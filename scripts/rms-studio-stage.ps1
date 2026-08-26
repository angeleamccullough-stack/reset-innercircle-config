param(
  [string[]]$ScanRoots = @(
    "$env:USERPROFILE\Music",
    "$env:USERPROFILE\Documents\Akai Pro",
    "$env:USERPROFILE\Documents\MPC",
    "$env:USERPROFILE\Documents\Image-Line",
    "$env:USERPROFILE\Documents\Ableton"
  ),
  [string]$StagingRoot = "$env:USERPROFILE\RMS_Studio_Staging"
)

$ErrorActionPreference = 'Stop'

$approvedExtensions = @(
  '.xpj','.mpcproject','.flp','.als','.logicx','.mid','.midi',
  '.wav','.aif','.aiff','.mp3'
)
$hardExcludedTokens = @('DAION','AURALYN')
$reviewDir = Join-Path $StagingRoot 'Review_Required'
$approvedDir = Join-Path $StagingRoot 'Approved'
$manifestPath = Join-Path $StagingRoot 'rms_studio_stage_manifest.csv'

New-Item -ItemType Directory -Path $reviewDir -Force | Out-Null
New-Item -ItemType Directory -Path $approvedDir -Force | Out-Null

function Test-HardExcluded([string]$Path) {
  $upper = $Path.ToUpperInvariant()
  foreach ($token in $hardExcludedTokens) {
    if ($upper.Contains($token)) { return $true }
  }
  return $false
}

function Test-Questionable([System.IO.FileInfo]$File) {
  $name = $File.Name.ToLowerInvariant()
  if ($name -match 'contract|agreement|license|invoice|receipt|tax|statement|passport|driver|ssn') { return $true }
  if ($File.Length -eq 0) { return $true }
  return $false
}

$rows = New-Object System.Collections.Generic.List[object]

foreach ($root in $ScanRoots) {
  if (-not (Test-Path -LiteralPath $root)) { continue }

  Get-ChildItem -LiteralPath $root -File -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    $file = $_
    $ext = $file.Extension.ToLowerInvariant()
    if ($approvedExtensions -notcontains $ext) { return }
    if (Test-HardExcluded $file.FullName) {
      $rows.Add([pscustomobject]@{
        source = $file.FullName
        status = 'excluded_artist_asset'
        staged = ''
        size_bytes = $file.Length
        sha256 = ''
      })
      return
    }

    $hash = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash
    $safeBase = ($file.BaseName -replace '[^A-Za-z0-9._-]','_')
    $safeName = "$safeBase$ext"
    $destinationDir = if (Test-Questionable $file) { $reviewDir } else { $approvedDir }
    $destination = Join-Path $destinationDir $safeName

    if (Test-Path -LiteralPath $destination) {
      $existingHash = (Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash
      if ($existingHash -ne $hash) {
        $destination = Join-Path $destinationDir ("{0}_{1}{2}" -f $safeBase,$hash.Substring(0,8),$ext)
      }
    }

    Copy-Item -LiteralPath $file.FullName -Destination $destination -Force

    $rows.Add([pscustomobject]@{
      source = $file.FullName
      status = if ($destinationDir -eq $reviewDir) { 'review_required' } else { 'approved_staged_copy' }
      staged = $destination
      size_bytes = $file.Length
      sha256 = $hash
    })
  }
}

$rows | Export-Csv -LiteralPath $manifestPath -NoTypeInformation -Encoding UTF8

Write-Host "RMS Studio staging complete."
Write-Host "Approved copies: $approvedDir"
Write-Host "Review queue: $reviewDir"
Write-Host "Manifest: $manifestPath"
Write-Host "Original source files were NOT moved or deleted."
