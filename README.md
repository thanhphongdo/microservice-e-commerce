# microservice-e-commerce

Monorepo local development setup for the e-commerce microservice system.

Local development standard: use `.env.local` as the single source of truth for Docker Compose runtime values.

## Services

- `auth-service` (gRPC)
- `payment-service` (gRPC)
- `order-service` (gRPC)
- `product-service` (gRPC)
- `bff-gateway` (GraphQL + gRPC clients)
- `proto-contracts` (shared generated contracts)

## Prerequisites

- Docker + Docker Compose v2
- Node.js 24.x and npm (only needed when running services outside containers)

## Quick Start (Local)

1. Review and adjust local environment values in `.env.local` if needed.

2. Start full stack:

   ```bash
   docker compose --env-file .env.local -f infra/docker-compose.yml up -d --build
   ```

3. Follow logs:

   ```bash
   docker compose --env-file .env.local -f infra/docker-compose.yml logs -f
   ```

4. Stop stack:

   ```bash
   docker compose --env-file .env.local -f infra/docker-compose.yml down
   ```

## Production Compose

`infra/docker-compose.prod.yml` is for production-like deployment with prebuilt images.
It does not mount source code and does not expose internal gRPC/debug ports.

1. Create production env file from template:

   ```bash
   cp .env.prod.example .env.prod
   ```

2. Update secret values in `.env.prod` (especially `POSTGRES_PASSWORD`) and adjust image tags if needed.

3. Validate config:

   ```bash
   docker compose --env-file .env.prod -f infra/docker-compose.prod.yml config
   ```

4. Start:

   ```bash
   docker compose --env-file .env.prod -f infra/docker-compose.prod.yml up -d
   ```

5. Stop:

   ```bash
   docker compose --env-file .env.prod -f infra/docker-compose.prod.yml down
   ```

## Production Workflow (GitHub Actions)

Workflow file: `.github/workflows/prod.yml`

- On push to `main`: build and push all service images to GHCR and Docker Hub with tags:
  - `sha-<commit_sha>`
  - `latest`
- Manual deploy: run the workflow with `deploy=true` to deploy over SSH.

Required repository secrets:

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`
- `DEPLOY_PORT` (optional, defaults to `22`)
- `DEPLOY_PATH` (absolute path on server where repo and `.env.prod` exist)
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

## Runbook 6 Lenh

Use these commands to avoid missing-env issues.
Do not run `docker compose` without `--env-file .env.local`.

```bash
# 1) Validate compose + env interpolation
docker compose --env-file .env.local -f infra/docker-compose.yml config

# 2) Start full stack
docker compose --env-file .env.local -f infra/docker-compose.yml up -d --build

# 3) Check running services
docker compose --env-file .env.local -f infra/docker-compose.yml ps

# 4) Follow logs
docker compose --env-file .env.local -f infra/docker-compose.yml logs -f

# 5) Restart full stack
docker compose --env-file .env.local -f infra/docker-compose.yml down && docker compose --env-file .env.local -f infra/docker-compose.yml up -d --build

# 6) Stop and remove volumes
docker compose --env-file .env.local -f infra/docker-compose.yml down -v
```

## Local Ports

- BFF: `13000 -> 3000`
- Auth gRPC: `15051 -> 50051`
- Payment gRPC: `15052 -> 50052`
- Order gRPC: `15053 -> 50053`
- Product gRPC: `15054 -> 50054`
- Postgres: `15432 -> 5432`
- Redis: `16379 -> 6379`
- Kafka external: `19092 -> 9092`
- Zookeeper external: `12181 -> 2181`

## Debug Ports

- BFF: `59229`
- Auth: `19229`
- Payment: `29229`
- Order: `39229`
- Product: `49229`

Use the VS Code launch configuration `Attach: all services` to attach debuggers to all Node services.

## Proto Contracts

`proto-contracts` is mounted into each service and consumed as a local package (`file:../proto-contracts`).

To regenerate TypeScript contracts manually:

```bash
cd proto-contracts
npm install
npm run build
```

## Notes

- Infrastructure dependencies (`kafka`, `postgres`, `redis`, `zookeeper`) use healthchecks so app services wait for readiness before startup.
- Each app container runs `npm run start:debug`. If `node_modules` is missing or incomplete, container startup will run `npm install` automatically before booting the service.
- Docker Compose runtime values are loaded from `.env.local` via `--env-file .env.local`.
- This compose file is optimized for development, not production deployment.
