#!/usr/bin/env bash
# Deploy script for DigitalOcean Droplet (Linux)
# Usage: ./scripts/deploy.sh <droplet_user>@<droplet_ip> [--private-key /path/to/key] [--repo <git_repo_url>]

set -euo pipefail

SSH_TARGET=${1:-}
REPO_URL=${2:-}
KEY_FLAG=""

if [ -z "$SSH_TARGET" ]; then
  echo "Usage: $0 <user@droplet-ip> [repo_url] [--private-key /path/to/key]"
  exit 1
fi

# Optional args parsing (simple)
while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --private-key)
      KEY_FLAG="-i $2"
      shift 2
      ;;
    --repo)
      REPO_URL="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

REMOTE_DIR="~/ecoconnect-sphere"

echo "Connecting to $SSH_TARGET"

# Install Docker and docker-compose on the droplet (Ubuntu/Debian)
ssh $KEY_FLAG $SSH_TARGET bash -lc "'
  set -e
  echo "[deploy] Updating apt..."
  sudo apt-get update -y
  echo "[deploy] Installing Docker..."
  if ! command -v docker >/dev/null 2>&1; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
  fi
  echo "[deploy] Installing docker-compose-plugin..."
  sudo apt-get install -y docker-compose-plugin
  sudo usermod -aG docker \$(whoami) || true

  # Clone or update repo
  if [ -n \"$REPO_URL\" ]; then
    echo "[deploy] Cloning repository..."
    rm -rf $REMOTE_DIR || true
    git clone $REPO_URL $REMOTE_DIR
  else
    echo "[deploy] Ensuring remote dir exists..."
    mkdir -p $REMOTE_DIR
  fi

  cd $REMOTE_DIR
  echo "[deploy] Running docker compose up -d --build"
  sudo docker compose pull --ignore-pull-failures || true
  sudo docker compose up -d --build
'"]

echo "Deployment triggered."
