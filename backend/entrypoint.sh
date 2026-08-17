#!/bin/sh
# Backend container entrypoint: apply database migrations, then start the API.
set -e

echo "[entrypoint] Applying database migrations..."
alembic -c database/alembic.ini upgrade head

echo "[entrypoint] Starting API server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
