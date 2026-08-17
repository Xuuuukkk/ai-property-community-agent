# Deployment Guide / 系统部署说明

> AI Property Community Agent — Deployment Specification

---

## 1. Deployment Overview / 部署概述

本项目采用容器化部署。生产环境由 4 个核心服务组成：

- **Frontend** — React + Vite 静态站点，Nginx 提供反向代理 + SSL
- **Backend** — FastAPI 后端（含 Agent Runtime）
- **PostgreSQL 16 + pgvector** — 业务数据与向量索引
- **Redis** — 缓存

```
                 User
                  │
             Frontend (Nginx + SSL)
                  │
              Backend
        ┌─────────┼─────────┐
        │         │         │
   PostgreSQL   Redis   (pgvector
   + pgvector           内嵌)
```

---

## 2. Environment Requirements / 环境要求

### Minimum Hardware

| 环境 | CPU | Memory | Storage |
|------|-----|--------|---------|
| 开发 | 4 Core+ | 8GB+ | 20GB+ |
| 生产 | 4 Core+ | 8GB+ | 40GB+ |

### Software

- Docker >= 24
- Docker Compose >= 2
- Git

---

## 3. Quick Start / 快速启动

### 3.1 Clone and configure

```bash
git clone https://github.com/Xuuuukkk/ai-property-community-agent.git
cd ai-property-community-agent

cp .env.example .env
# Edit .env with your real values
```

### 3.2 Development environment

```bash
# Start all services
docker compose up -d --build

# Apply migrations
docker compose exec backend alembic -c /app/database/alembic.ini upgrade head

# Import seed data
docker compose exec backend python scripts/import_seed_data.py

# Index knowledge base (uses deterministic embedding by default)
docker compose exec backend python -m scripts.index_knowledge_base --embedding-model deterministic
```

Access:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

### 3.3 Production environment

> Production requires valid SSL certificates. Place `cert.pem` and `key.pem`
> under `./ssl/` before starting, or temporarily use the HTTP-only nginx block
> documented in `nginx/nginx.prod.conf`.

```bash
cp .env.production.example .env
# Fill in production values

# One-shot deploy: pull images, start services, wait for health.
# The backend entrypoint applies database migrations automatically.
./deploy.sh
```

Or manually, without the helper script:

```bash
docker compose -f docker-compose.prod.yml up -d --build

# Import seed data (one-time; migrations are applied automatically on boot)
docker compose -f docker-compose.prod.yml exec backend python scripts/import_seed_data.py

# Index knowledge base
docker compose -f docker-compose.prod.yml exec backend python -m scripts.index_knowledge_base
```

Access:

- Frontend + API: https://your-domain.com
- Health: https://your-domain.com/api/health
- Metrics: https://your-domain.com/api/metrics

---

## 4. Configuration / 配置说明

All configuration lives in the root `.env` file. See `.env.example` for the
full template.

Key variables:

| Variable | Description |
|----------|-------------|
| `APP_ENV` | `local`, `docker`, or `production` |
| `DATABASE_URL` | SQLAlchemy connection URL |
| `REDIS_URL` | Redis connection URL |
| `SECRET_KEY` | Secret for signed tokens / sessions |
| `BACKEND_CORS_ORIGINS` | Allowed frontend origins |
| `LLM_API_KEY` | OpenAI-compatible API key (optional) |
| `EMBEDDING_MODEL` | Embedding model name or `deterministic` |
| `VITE_API_BASE_URL` | Frontend API base URL |
| `DOMAIN` | Public domain for SSL |

---

## 5. Docker Compose Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Development with hot-reload |
| `docker-compose.prod.yml` | Production with SSL, restart policies, resource limits |
| `docker-compose.monitoring.yml` | Optional Prometheus + Grafana stack |

---

## 6. SSL Certificates / SSL 证书

For production, obtain certificates from Let's Encrypt or another CA and place
them at:

```
ssl/cert.pem
ssl/key.pem
```

Then mount them in `docker-compose.prod.yml`:

```yaml
volumes:
  - ./ssl/cert.pem:/etc/nginx/ssl/cert.pem:ro
  - ./ssl/key.pem:/etc/nginx/ssl/key.pem:ro
```

For local demo without certificates, use the HTTP-only server block in
`nginx/nginx.prod.conf`.

---

## 7. Database Initialization / 数据库初始化

Sequence:

1. Start PostgreSQL container
2. Alembic migrations run automatically via `backend/entrypoint.sh` on container boot
3. Import seed data from `data/seed/`
4. (Optional) Index knowledge base into pgvector

```bash
# Migrations run automatically on boot. Seed + knowledge indexing are one-time:
docker compose -f docker-compose.prod.yml exec backend python scripts/import_seed_data.py
docker compose -f docker-compose.prod.yml exec backend python -m scripts.index_knowledge_base --embedding-model deterministic
```

> In development (`docker-compose.yml`) the backend runs plain `uvicorn` without
> the migration entrypoint, so apply migrations manually:
> `docker compose exec backend alembic -c /app/database/alembic.ini upgrade head`

---

## 8. Backup / 数据备份

A one-shot backup service is defined in `docker-compose.prod.yml` under the
`backup` profile.

Run manually:

```bash
docker compose -f docker-compose.prod.yml --profile backup run --rm backup
```

Backups are written to `./backups/` in PostgreSQL custom format (`-Fc`).
Schedule this command via cron or a scheduler for automated backups.

To restore:

```bash
pg_restore -h postgres -U admin -d property_agent -c /backups/property_agent_YYYYMMDD_HHMMSS.dump
```

---

## 9. Monitoring / 监控

The backend exposes Prometheus metrics at `/api/metrics`.

To start the optional monitoring stack:

```bash
docker compose -f docker-compose.monitoring.yml up -d
```

Access:

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (default login `admin/admin`)

---

## 10. CI/CD / 持续集成

GitHub Actions workflow: `.github/workflows/ci.yml`

Runs on every push and pull request to `main`:

- Backend tests against PostgreSQL + pgvector and Redis service containers
- Frontend build
- npm audit vulnerability check
- Docker Compose file validation

---

## 11. Health Checks / 健康检查

| Service | Endpoint |
|---------|----------|
| Backend liveness | `GET /api/health` |
| Backend readiness | `GET /api/health/ready` |
| Backend metrics | `GET /api/metrics` |
| Frontend | page load on `/` |
| PostgreSQL | `pg_isready` |
| Redis | `redis-cli ping` |

---

## 12. Production Checklist / 生产检查清单

Before going live:

- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Change `POSTGRES_PASSWORD` and `DATABASE_URL` credentials
- [ ] Obtain and place SSL certificates under `./ssl/`
- [ ] Set `BACKEND_CORS_ORIGINS` to the production frontend URL only
- [ ] Set `VITE_API_BASE_URL` to the production API URL
- [ ] Run migrations and import seed data
- [ ] Configure automated backups
- [ ] (Optional) Configure real LLM / embedding model
- [ ] (Optional) Start monitoring stack
