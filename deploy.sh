#!/usr/bin/env bash
# One-shot production deployment for AI Property Community Agent.
#
# Usage (from the repository root, on the production server):
#   ./deploy.sh
#
# Prerequisites (see docs/07-operation or docs/production-deployment.md):
#   1. A filled-in `.env` (copy from .env.production.example).
#   2. SSL certificate + key at ./ssl/cert.pem and ./ssl/key.pem.
#
# What it does:
#   1. Pulls the latest code and container images.
#   2. Recreates containers. The backend entrypoint applies database
#      migrations automatically before starting the API.
#   3. Waits for all services to become healthy.
set -euo pipefail

COMPOSE="docker compose -f docker-compose.prod.yml"

echo "==> [1/4] Pulling latest code..."
git pull --ff-only

echo "==> [2/4] Pulling latest images..."
$COMPOSE pull

echo "==> [3/4] Starting services (migrations run automatically)..."
$COMPOSE up -d --remove-orphans

echo "==> [4/4] Waiting for services to become healthy..."
# Poll container health for up to ~90 seconds.
for _ in $(seq 1 30); do
  unhealthy=$($COMPOSE ps --format '{{.Name}} {{.Health}}' | grep -c 'unhealthy\|starting' || true)
  if [ "$unhealthy" -eq 0 ]; then
    echo "==> All services are healthy."
    echo ""
    echo "Deployment complete. Check the site at your configured domain."
    echo "Run 'docker compose -f docker-compose.prod.yml ps' to inspect status."
    exit 0
  fi
  sleep 3
done

echo "!! Some services did not become healthy in time."
echo "   Inspect with: docker compose -f docker-compose.prod.yml logs --tail=100"
exit 1
