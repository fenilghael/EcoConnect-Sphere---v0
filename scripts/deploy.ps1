<#
Deploy script for DigitalOcean Droplet (PowerShell)
Usage examples:
  pwsh.exe ./scripts/deploy.ps1 -Target user@1.2.3.4 -Repo https://github.com/you/repo.git -KeyPath C:\Users\you\.ssh\id_rsa
  pwsh.exe ./scripts/deploy.ps1 -Target user@1.2.3.4
#>
param(
  [Parameter(Mandatory=$true)] [string] $Target,
  [string] $Repo = "",
  [string] $KeyPath = ""
)

$remoteDir = "~/ecoconnect-sphere"
$scpKeyArg = if ($KeyPath -ne "") { "-i `"$KeyPath`"" } else { "" }

Write-Host "Connecting to $Target"

$sshCmd = @"
set -e
if ! command -v docker >/dev/null 2>&1; then
  echo "[deploy] Installing Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  rm get-docker.sh
fi
sudo apt-get install -y docker-compose-plugin || true
sudo usermod -aG docker \$(whoami) || true
mkdir -p $remoteDir
cd $remoteDir
"@

if ($Repo -ne "") {
  $sshCmd += "rm -rf $remoteDir || true\ngit clone $Repo $remoteDir\n"
}

$sshCmd += "sudo docker compose pull --ignore-pull-failures || true\nsudo docker compose up -d --build\n"

$sshCmdEscaped = $sshCmd -replace '"','\"'

$fullSsh = "ssh $scpKeyArg $Target \"$sshCmdEscaped\""

Write-Host "Running remote commands..."
cmd /c $fullSsh

Write-Host "Deployment triggered."
