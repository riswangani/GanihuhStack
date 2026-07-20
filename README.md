# GanihuhStack

Personal software engineering platform — portfolio website, technical blog, and knowledge management system built as a long-term engineering laboratory.

The business domain stays intentionally simple (blog posts, projects, a "what I'm doing now" page). The complexity that's allowed to grow is **engineering practice** — architecture, testing, CI/CD, observability.

---

## Tech Stack

### Backend

- **ASP.NET Core** — Minimal API (REST only)
- **Clean Architecture** — Jason Taylor template
- **CQRS** — MediatR
- **Validation** — FluentValidation
- **ORM** — Entity Framework Core + PostgreSQL

### Frontend

- **React 19** + TypeScript (strict mode)
- **Vite** + React Router
- **TanStack Query** — server state management
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui** — accessible component primitives (admin area)

### Infrastructure

- **.NET Aspire** — local dev orchestration
- **PostgreSQL** — primary database
- **GitHub Actions** — CI/CD _(coming soon)_
- **Azure Container Apps** — production hosting _(coming soon)_

---

## Architecture

This project uses **Clean Architecture** combined with **CQRS** pattern.

### Clean Architecture

> Business logic must not depend on frameworks, databases, or UI.

```
┌─────────────────────────────────┐
│           Web (UI/API)          │  ← HTTP endpoints, request/response shaping
│  ┌───────────────────────────┐  │
│  │      Infrastructure       │  │  ← EF Core, PostgreSQL, external services
│  │  ┌─────────────────────┐  │  │
│  │  │     Application     │  │  │  ← business logic, CQRS handlers
│  │  │  ┌───────────────┐  │  │  │
│  │  │  │    Domain     │  │  │  │  ← entities, pure business rules
│  │  │  └───────────────┘  │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**Dependency rule — arrows point inward only:**

```
Web → Application → Domain
Infrastructure → Application → Domain
```

| Layer          | Location              | Responsibility                                          |
| -------------- | --------------------- | ------------------------------------------------------- |
| Domain         | `src/Domain/`         | Entities, pure business rules, no external dependencies |
| Application    | `src/Application/`    | CQRS handlers, validation, interfaces, Business Rules   |
| Infrastructure | `src/Infrastructure/` | EF Core, PostgreSQL, external services                  |
| Web            | `src/Web/`            | Minimal API endpoints, HTTP concerns                    |

### CQRS

> Separate operations that change data (Command) from operations that read data (Query).

```
Command → mutates state, returns id or void
Query   → reads state, changes nothing
```

Every feature is organized by entity under `Application/`:

```
Application/
├── BlogPosts/
│   ├── Commands/
│   │   ├── CreateBlogPost/   ← CreateBlogPostCommand + Validator + Handler
│   │   ├── UpdateBlogPost/   ← UpdateBlogPostCommand + Validator + Handler
│   │   └── DeleteBlogPost/   ← DeleteBlogPostCommand + Handler
│   └── Queries/
│       └── GetBlogPosts/     ← GetBlogPostsQuery + Handler + DTO
├── Projects/
└── NowStatus/
```

### MediatR Pipeline

Every command and query passes through this pipeline automatically:

```
Request
  → LoggingBehaviour          (log request + user)
  → UnhandledExceptionBehaviour (catch unexpected errors)
  → AuthorizationBehaviour    (permission check)
  → ValidationBehaviour       (FluentValidation, throws 400 if invalid)
  → Handler                   (business logic)
  → PerformanceBehaviour      (warn if > 500ms)
```

---

## Solution Structure

```
GanihuhStack/
├── src/
│   ├── AppHost/          # .NET Aspire orchestrator — entry point for local dev
│   ├── ServiceDefaults/  # Shared Aspire config (telemetry, health, resilience)
│   ├── Domain/           # Entities, Value Objects, Domain Events
│   ├── Application/      # CQRS handlers, validators, interfaces, DTOs
│   ├── Infrastructure/   # EF Core, Identity, external services
│   ├── Web/              # Minimal API endpoints
│   │   └── ClientApp/    # React + Vite frontend
│   └── Shared/           # Shared constants across AppHost + Infrastructure
└── tests/
    ├── Domain.UnitTests/
    ├── Application.UnitTests/
    ├── Application.FunctionalTests/
    ├── Infrastructure.IntegrationTests/
    └── Web.AcceptanceTests/
```

---

## Running Locally

Prerequisites: [.NET 10 SDK](https://dotnet.microsoft.com/download), [Bun](https://bun.sh/), [.NET Aspire workload](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/setup-tooling)

### Option A: Via .NET Aspire (Daily Development — Recommended)

Gunakan opsi ini saat koding fitur harian. Tidak perlu me-build image Docker secara manual.

```bash
# 1. Pastikan Aspire workload terinstall (sekali saja)
dotnet workload install aspire

# 2. Install dependency frontend (Bun)
cd src/Web/ClientApp
bun install
cd ../../..

# 3. Jalankan orchestrator Aspire
dotnet run --project src/AppHost
```

Aspire akan menyalakan Web API, React Frontend (Vite + Bun), dan PostgreSQL secara otomatis. Dashboard observabilitas (Traces, Logs, Metrics) dapat diakses via URL dashboard yang tampil di terminal.

### Option B: Via Docker Compose (Testing Container Environment)

Gunakan opsi ini jika ingin mengetes integrasi multi-container lokal (Web API, React ClientApp, PostgreSQL) sebelum deploy ke VPS/Cloud.

**Prasyarat:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) atau Docker Engine dalam kondisi *running*.

```bash
# Build & jalankan semua container di background
docker compose up --build

# Untuk menghentikan & membersihkan container
docker compose down
```

**End-point Services:**
- **Frontend (React + Nginx)**: `http://localhost:3000`
- **Backend (Web API + Scalar Docs)**: `http://localhost:8080/scalar/v1`
- **Database (PostgreSQL 17)**: `localhost:5432` (User: `postgres`, Pass: `Password123!`)

### Option C: Future Kubernetes Testing (Aspirate + k3d)

Gunakan opsi ini saat ingin belajar & mengetes deployment Kubernetes di laptop:

```bash
# 1. Install CLI Aspirate (sekali saja)
dotnet tool install -g Aspirate

# 2. Generate manifes Kubernetes / Helm Chart dari Aspire AppHost
aspirate generate

# 3. Apply manifes ke cluster Kubernetes lokal (k3d / Minikube)
kubectl apply -f k8s/
```

---

## Roadmap

### Phase 1 — MVP _(completed)_

- [x] Project setup (Clean Architecture + React + Vite)
- [x] .NET Aspire orchestration
- [x] Authentication
- [x] Blog CRUD (backend + public page + dashboard)
- [x] Projects CRUD (backend + public page + dashboard)
- [x] Now-status CRUD (backend + public page + dashboard)
- [x] Public portfolio pages (Now, Projects, About, Contact, Resume)

### Phase 2 — Containerization & Production Config _(completed)_

- [x] Multi-stage Dockerfile for Web API (`src/Web/Dockerfile`)
- [x] Multi-stage Dockerfile + Nginx for ClientApp (`src/Web/ClientApp/Dockerfile` & `nginx.conf`)
- [x] Local multi-container orchestration (`docker-compose.yml`)
- [x] Kubernetes learning roadmap & `Aspirate` manifest generation strategy

### Phase 3 — CI/CD (GitHub Actions)

### Phase 4 — Cloud Deployment (Azure Container Apps)

### Phase 5 — Observability (OpenTelemetry, Prometheus, Grafana)

### Phase 6 — Background jobs, Redis, events

### Phase 7 — Extended content (Notes, Uses, Resume)

---

## Pages

| Route        | Description                                            | Status      |
| ------------ | ------------------------------------------------------ | ----------- |
| `/`          | Home — featured post, current focus, selected projects | ✓           |
| `/blog`      | Blog list                                              | ✓           |
| `/now`       | What I'm currently focused on                          | coming soon |
| `/projects`  | Portfolio projects                                     | coming soon |
| `/about`     | About me                                               | coming soon |
| `/contact`   | Contact                                                | coming soon |
| `/resume`    | CV                                                     | coming soon |
| `/dashboard` | Admin — manage blog, projects, now-status              | ✓ (blog)    |

---

## Documentation

| File                    | Description                                         |
| ----------------------- | --------------------------------------------------- |
| `MEDIATR.md`            | MediatR registration, pipeline, and usage explained |
| `HOW-TO-ADD-FEATURE.md` | Step-by-step guide to add a new CRUD feature        |
