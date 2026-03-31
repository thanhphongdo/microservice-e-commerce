# microservice-e-commerce

Monorepo local development setup for the e-commerce microservice system.

Local development standard: use `.env.local` as the single source of truth for Docker Compose runtime values.

## Services

- `auth-service` (gRPC)
- `payment-service` (gRPC)
- `order-service` (gRPC)
- `product-service` (gRPC)
- `bff-gateway` (GraphQL + gRPC clients)
- `e-commerce-fe` (Next.js frontend)
- `e-commerce-admin-fe` (Next.js admin frontend)
- `meilisearch` (product search infra placeholder)
- `minio` (object storage infra placeholder)
- `proto-contracts` (shared generated contracts)

## Prerequisites

- Docker + Docker Compose v2
- Node.js 24.x and npm (only needed when running services outside containers)

## Machine Requirements (Warning)

Running the full local stack is resource intensive (`13+` containers, multiple watchers, Kafka, Meilisearch, MinIO).

- Minimum (can run, may lag): `6 CPU cores`, `16 GB RAM`, `30-40 GB` free disk
- Recommended (stable daily dev): `8 CPU cores`, `24-32 GB RAM`, `50+ GB` free disk
- Docker Desktop memory recommendation: `10-16 GB`

## Reduce Local Load (for weaker machines)

- Run only required services instead of full stack.
- Temporarily stop one frontend (`e-commerce-fe` or `e-commerce-admin-fe`) when not needed.
- Run frontends outside Docker (`npm run dev`) and keep backend/infra in Docker.
- Skip live codegen watch, and run on demand:

  ```bash
  npm run codegen
  ```

- If event features are not needed, temporarily stop `kafka` and `zookeeper`.

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

5. Start frontend projects outside Docker:

   ```bash
   cd e-commerce-fe
   NEXT_PUBLIC_GRAPHQL_URL=http://localhost:13000/graphql npm run codegen:watch
   # in another terminal
   NEXT_PUBLIC_GRAPHQL_URL=http://localhost:13000/graphql npm run dev

   # admin app
   cd ../e-commerce-admin-fe
   NEXT_PUBLIC_GRAPHQL_URL=http://localhost:13000/graphql npm run codegen:watch
   # in another terminal
   NEXT_PUBLIC_GRAPHQL_URL=http://localhost:13000/graphql npm run dev
   ```

6. Open frontend:

   - `http://localhost:3700`
   - `http://localhost:3800` (admin)

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
- Build is optimized to publish only changed services; if `proto-contracts`, production compose, or workflow changes, all services are rebuilt.
- Production images are built from `Dockerfile.prod` (multi-stage), run `npm run build` at build time, and start with `node dist/main` (no `start:debug`).
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

- Frontend: `3700` (run outside Docker in local dev)
- Admin Frontend: `3800` (run outside Docker in local dev)
- BFF: `13000 -> 3000`
- Auth gRPC: `15051 -> 50051`
- Payment gRPC: `15052 -> 50052`
- Order gRPC: `15053 -> 50053`
- Product gRPC: `15054 -> 50054`
- Postgres: `15432 -> 5432`
- Redis: `16379 -> 6379`
- Meilisearch: `17700 -> 7700`
- MinIO API: `19000 -> 9000`
- MinIO Console: `19001 -> 9001`
- Kafka external: `19092 -> 9092`
- Zookeeper external: `12181 -> 2181`

## GraphQL Autocomplete for FE

Use GraphQL language tooling so `.graphql` files in both FE projects can suggest fields and validate queries.

1. Install extension in Cursor/VS Code:

   - `graphql.vscode-graphql`

2. Configure GraphQL projects at monorepo root (`graphql.config.yml`):

   ```yml
   projects:
     e-commerce-fe:
       schema: "http://localhost:13000/graphql"
       documents: "e-commerce-fe/src/graphql/**/*.graphql"
     e-commerce-admin-fe:
       schema: "http://localhost:13000/graphql"
       documents: "e-commerce-admin-fe/src/graphql/**/*.graphql"
   ```

3. Optional fallback when opening FE folders independently:

   - `e-commerce-fe/graphql.config.yml`
   - `e-commerce-admin-fe/graphql.config.yml`

   ```yml
   schema: "http://localhost:13000/graphql"
   documents: "src/graphql/**/*.graphql"
   ```

4. Requirements for autocomplete/suggestions:

   - BFF must be running at `http://localhost:13000/graphql`
   - Reload editor window after adding config (`Developer: Reload Window`)

5. Codegen flow (why `.graphql` is not imported directly at runtime):

   - Write operations in `src/graphql/**/*.graphql`
   - Run `npm run codegen` or `npm run codegen:watch`
   - Generated document nodes are written to `src/graphql/generated.ts`
   - App code imports `...Document` from `@/graphql/generated`

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
- Frontend projects run outside Docker in local development (recommended for lower container overhead).
- BFF CORS is configured to allow frontend origins from `CORS_ORIGINS` (default: `http://localhost:3700,http://localhost:3800`).
- `meilisearch` and `minio` are provisioned for future search/upload features (not wired into business flows yet).
- Docker Compose runtime values are loaded from `.env.local` via `--env-file .env.local`.
- This compose file is optimized for development, not production deployment.
