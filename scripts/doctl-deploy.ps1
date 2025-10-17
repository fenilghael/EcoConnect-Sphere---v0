<#
PowerShell helper to create DO App Platform app from `doctl-app.yaml` and set secrets.
Usage (pwsh):
  # Ensure doctl is installed and authenticated: doctl auth init
  pwsh.exe ./scripts/doctl-deploy.ps1 -MongoUri "<mongo-uri>" -JwtSecret "<jwt-secret>"

This script will:
 - check for doctl
 - prompt for missing values
 - create secrets in DigitalOcean App Platform
 - create the app using `doctl apps create --spec ./doctl-app.yaml`

Note: This runs `doctl` locally (it won't run here). Keep secrets secure.
#>
param(
  [string] $MongoUri = "",
  [string] $JwtSecret = "",
  [string] $SpecPath = "./doctl-app.yaml"
)

function FailIfNotDoctl {
  if (-not (Get-Command doctl -ErrorAction SilentlyContinue)) {
    Write-Error "doctl CLI not found. Install from https://docs.digitalocean.com/reference/doctl/ and run 'doctl auth init' before running this script."
    exit 1
  }
}

FailIfNotDoctl

if ([string]::IsNullOrWhiteSpace($MongoUri)) {
  $MongoUri = Read-Host -Prompt "Enter MONGODB_URI (MongoDB Atlas connection string)"
}
if ([string]::IsNullOrWhiteSpace($JwtSecret)) {
  $JwtSecret = Read-Host -Prompt "Enter JWT_SECRET (will be stored as a DO secret)"
}

Write-Host "Creating secrets in DigitalOcean App Platform..."
Write-Host "Preparing temporary app spec with secrets injected..."

$specJson = Get-Content -Raw $SpecPath

# Convert YAML spec to JSON via yq if available, otherwise assume doctl accepts YAML file directly.
# We'll inject secrets by creating a small wrapper spec that contains the secrets and references the original spec.

$tempSpecPath = [System.IO.Path]::GetTempFileName() + ".yaml"

$injected = @"
name: ecoconnect-sphere
secrets:
  - key: MONGODB_URI
    value: "$MongoUri"
    type: "encrypted"
  - key: JWT_SECRET
    value: "$JwtSecret"
    type: "encrypted"
"@

# Append the original spec.
Add-Content -Path $tempSpecPath -Value $injected
Get-Content -Path $SpecPath | Add-Content -Path $tempSpecPath

Write-Host "Creating the App Platform app from temporary spec: $tempSpecPath"

# Create the app using the temp spec
doctl apps create --spec $tempSpecPath
if ($LASTEXITCODE -ne 0) {
  Write-Error "Failed to create app. Review the doctl output above for errors."
  Remove-Item -Path $tempSpecPath -ErrorAction SilentlyContinue
  exit 1
}

# Clean up temp spec
Remove-Item -Path $tempSpecPath -ErrorAction SilentlyContinue

Write-Host "App creation request submitted. You can track progress in the DigitalOcean control panel or with:"
Write-Host "  doctl apps list"
Write-Host "  doctl apps get <APP_ID>"

Write-Host "Done."
