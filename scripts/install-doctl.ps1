<#
Install doctl helper for Windows (PowerShell)
Tries in order: winget, chocolatey, scoop, fallback to manual download and extraction.
Run from an elevated PowerShell optionally. Example:
  pwsh.exe -NoProfile -ExecutionPolicy Bypass ./scripts/install-doctl.ps1
#>

Write-Host "Installing doctl..." -ForegroundColor Cyan

function Try-Run {
    param($ScriptBlock)
    try {
        & $ScriptBlock
        return $true
    } catch {
        return $false
    }
}

# 1) Try winget
if (Get-Command winget -ErrorAction SilentlyContinue) {
    Write-Host "Found winget — installing doctl via winget..."
    $cmd = "winget install --id DigitalOcean.doctl -e --accept-package-agreements --accept-source-agreements"
    Write-Host $cmd
    iex $cmd
    if (Get-Command doctl -ErrorAction SilentlyContinue) {
        Write-Host "doctl installed via winget." -ForegroundColor Green
        exit 0
    }
}

# 2) Try chocolatey
if (Get-Command choco -ErrorAction SilentlyContinue) {
    Write-Host "Found chocolatey — installing doctl via choco..."
    iex "choco install doctl -y"
    if (Get-Command doctl -ErrorAction SilentlyContinue) {
        Write-Host "doctl installed via chocolatey." -ForegroundColor Green
        exit 0
    }
}

# 3) Try scoop
if (Get-Command scoop -ErrorAction SilentlyContinue) {
    Write-Host "Found scoop — installing doctl via scoop..."
    iex "scoop install doctl"
    if (Get-Command doctl -ErrorAction SilentlyContinue) {
        Write-Host "doctl installed via scoop." -ForegroundColor Green
        exit 0
    }
} else {
    # Offer to install scoop
    Write-Host "scoop not found. Installing scoop (user-level) and then doctl..."
    try {
        Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
        iex (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')
        iex "scoop install doctl"
        if (Get-Command doctl -ErrorAction SilentlyContinue) {
            Write-Host "doctl installed via scoop." -ForegroundColor Green
            exit 0
        }
    } catch {
        Write-Warning "scoop install failed or blocked. Will attempt manual download fallback."
    }
}

# 4) Manual download fallback
Write-Host "Falling back to manual download from GitHub releases..."

$apiUrl = 'https://api.github.com/repos/digitalocean/doctl/releases/latest'
try {
    $rel = Invoke-RestMethod -Uri $apiUrl -UseBasicParsing
} catch {
    Write-Error "Failed to query GitHub releases. Check network/permissions."
    exit 1
}

# Choose asset for windows amd64
$asset = $rel.assets | Where-Object { $_.name -match 'windows.*amd64.*zip' } | Select-Object -First 1
if (-not $asset) {
    $asset = $rel.assets | Where-Object { $_.name -match 'windows.*zip' } | Select-Object -First 1
}
if (-not $asset) {
    Write-Error "Could not find a Windows zip asset in the latest release. Visit https://github.com/digitalocean/doctl/releases to download manually."
    exit 1
}

$downloadUrl = $asset.browser_download_url
$dest = Join-Path $env:TEMP $asset.name
Write-Host "Downloading $downloadUrl to $dest"
Invoke-WebRequest -Uri $downloadUrl -OutFile $dest

# Extract to user bin
$destDir = Join-Path $env:USERPROFILE 'bin'
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($dest, $destDir)

# The zip contains doctl.exe at top-level or in a folder — find it
$exe = Get-ChildItem -Path $destDir -Filter 'doctl.exe' -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $exe) {
    Write-Error "doctl.exe not found after extracting. Please inspect $destDir and move doctl.exe to a folder on your PATH."
    exit 1
}

# Add user bin to PATH if not present
$currentPath = [Environment]::GetEnvironmentVariable('Path',[EnvironmentVariableTarget]::User)
if ($currentPath -notlike "*$destDir*") {
    Write-Host "Adding $destDir to user PATH"
    [Environment]::SetEnvironmentVariable('Path', "$currentPath;$destDir", [EnvironmentVariableTarget]::User)
    Write-Host "Note: restart your terminal to pick up the new PATH." -ForegroundColor Yellow
}

Write-Host "doctl installed to $($exe.FullName). Run 'doctl version' to confirm." -ForegroundColor Green

exit 0
