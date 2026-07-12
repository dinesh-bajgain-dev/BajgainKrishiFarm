# Bajgain Krishi Farm — Website

Monorepo for the farm's marketing website + admin panel.

- `apps/web` — Next.js (App Router, TypeScript, Tailwind CSS)
- `apps/api` — FastAPI (SQLAlchemy, Alembic, PostgreSQL)

## Local development

### 1. Database

Requires a local PostgreSQL server (developed against Postgres 17 via Homebrew: `brew services start postgresql@17`).

```bash
createdb bajgain_farm
createdb bajgain_farm_test   # used by the backend test suite
```

Set `DATABASE_URL` in `apps/api/.env` (copy from `.env.example`).

### 2. Backend (apps/api)

```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python -m app.seed.seed_data
uvicorn app.main:app --reload
```

API runs at http://localhost:8000. Seeded admin login is in `.env.example` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

Run tests: `pytest` (uses `bajgain_farm_test` database).

### 3. Frontend (apps/web)

```bash
cd apps/web
npm install
cp .env.local.example .env.local
npm run dev
```

Site runs at http://localhost:3000, admin panel at http://localhost:3000/admin.

## Docker (optional, Postgres only)

If Docker is available, `docker compose up -d db` starts a Postgres 16 container as an alternative to a native install. `apps/web` and `apps/api` are run natively in dev regardless, for fast hot-reload.

## Scope

This is a phased MVP: Home, About, Our Farm, Pig Breeds, Gallery, Products, Contact + a single-admin CMS panel. Blog/News, testimonials, full analytics, and e-commerce/booking are deferred to a later phase.
